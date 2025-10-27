import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio, processAudioFile, validateAudioFile, getAudioDuration } from '@/lib/audio/soniox';
import { getCurrentUser } from '@/lib/auth';
import { incrementUsage } from '@/lib/usage';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = (formData.get('language') as string) || 'auto';
    const enableSpeakerDiarization = formData.get('enableSpeakerDiarization') === 'true';
    const enableTimestamps = formData.get('enableTimestamps') !== 'false';

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    // Validate audio file
    const validation = validateAudioFile(audioFile);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get audio duration for usage calculation
    const duration = await getAudioDuration(audioFile);
    const durationMinutes = Math.ceil(duration / 60);

    // Check usage limits for audio minutes
    const usageCheck = await incrementUsage(user.id, 'audioMinutes', durationMinutes);
    if (!usageCheck.success) {
      return NextResponse.json(
        {
          error: 'Audio usage limit exceeded',
          message: usageCheck.message,
          limit: usageCheck.limit,
          current: usageCheck.current
        },
        { status: 429 }
      );
    }

    // Process audio file
    const audioBuffer = await processAudioFile(audioFile);

    // Transcribe audio
    const transcription = await transcribeAudio(audioBuffer, {
      language: language as 'en' | 'fr' | 'auto',
      enableSpeakerDiarization,
      enableTimestamps
    });

    // Save transcription to database
    const audioNote = await prisma.noteAudio.create({
      data: {
        userId: user.id,
        name: audioFile.name,
        path: `audio/${user.id}/${Date.now()}_${audioFile.name}`,
        duration: Math.floor(duration),
        size: audioFile.size,
        mimeType: audioFile.type,
        transcript: transcription as any, // Type assertion for Prisma Json field
        language: transcription.language,
        confidence: transcription.confidence,
        status: 'completed',
        processedAt: new Date()
      }
    });

    // TODO: Store the actual audio file in Supabase Storage
    // For now, we're just storing the metadata

    console.log(`Audio transcription completed for user ${user.id}, duration: ${durationMinutes} minutes`);

    return NextResponse.json({
      success: true,
      data: {
        id: audioNote.id,
        transcription: transcription.text,
        confidence: transcription.confidence,
        language: transcription.language,
        duration: Math.floor(duration),
        words: transcription.words,
        timestamp: new Date().toISOString()
      },
      usage: {
        audioMinutes: usageCheck.current,
        limit: usageCheck.limit,
        thisTranscription: durationMinutes
      }
    });

  } catch (error) {
    console.error('Error in audio transcribe route:', error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('Failed to transcribe audio')) {
        return NextResponse.json(
          { error: 'Audio transcription failed. Please try again.' },
          { status: 500 }
        );
      }

      if (error.message.includes('Invalid audio format')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      if (error.message.includes('too large')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}