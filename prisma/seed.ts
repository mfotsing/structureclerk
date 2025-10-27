import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.integrationAccount.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.task.deleteMany();
  await prisma.noteAudio.deleteMany();
  await prisma.document.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.legalConsents.deleteMany();
  await prisma.usageCounters.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'demo@structureclerk.ca',
        clerkId: 'demo-user-1',
        firstName: 'Demo',
        lastName: 'User',
        language: 'en',
        plan: 'PRO',
        legalConsents: {
          create: {
            cookiesConsent: true,
            aiProcessing: true,
            marketing: false,
            dataRetention: true,
            analyticsConsent: true,
          },
        },
        usage: {
          create: {
            month: new Date().toISOString().slice(0, 7),
            docsCount: 15,
            audioMinutes: 45,
            storageBytes: BigInt(1024 * 1024 * 250), // 250MB
            aiRequests: 23,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'entreprise@structureclerk.ca',
        clerkId: 'demo-user-2',
        firstName: 'Entreprise',
        lastName: 'Démo',
        language: 'fr',
        plan: 'BUSINESS',
        legalConsents: {
          create: {
            cookiesConsent: true,
            aiProcessing: true,
            marketing: true,
            dataRetention: true,
            analyticsConsent: true,
          },
        },
        usage: {
          create: {
            month: new Date().toISOString().slice(0, 7),
            docsCount: 156,
            audioMinutes: 234,
            storageBytes: BigInt(1024 * 1024 * 2048), // 2GB
            aiRequests: 189,
          },
        },
      },
    }),
  ]);

  console.log('✅ Created demo users');

  // Create sample clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        userId: users[0].id,
        name: 'Acme Corporation',
        email: 'billing@acme.com',
        company: 'Acme Corp',
        phone: '+1-514-555-0123',
        address: JSON.stringify({
          street: '123 Rue Ste-Catherine',
          city: 'Montréal',
          province: 'QC',
          postalCode: 'H3B 2B6',
          country: 'Canada',
        }),
        tags: ['enterprise', 'retail', 'recurring'],
      },
    }),
    prisma.client.create({
      data: {
        userId: users[0].id,
        name: 'TechStartup Inc.',
        email: 'projects@techstartup.io',
        company: 'TechStartup Inc.',
        phone: '+1-416-555-0456',
        tags: ['startup', 'technology', 'project'],
      },
    }),
    prisma.client.create({
      data: {
        userId: users[1].id,
        name: 'Gouvernement du Québec',
        email: 'contrats@gouv.qc.ca',
        company: 'Ministère des Services',
        phone: '+1-418-555-0789',
        tags: ['government', 'public-sector', 'formal'],
      },
    }),
  ]);

  console.log('✅ Created sample clients');

  // Create sample projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        userId: users[0].id,
        clientId: clients[0].id,
        name: 'Website Redesign 2024',
        description: 'Complete redesign of Acme corporate website',
        status: 'active',
        priority: 3,
        tags: ['web', 'design', 'q1-2024'],
        startDate: new Date('2024-01-15'),
        dueDate: new Date('2024-03-30'),
      },
    }),
    prisma.project.create({
      data: {
        userId: users[0].id,
        clientId: clients[1].id,
        name: 'Mobile App Development',
        description: 'iOS and Android app for customer portal',
        status: 'active',
        priority: 4,
        tags: ['mobile', 'development', 'q2-2024'],
        startDate: new Date('2024-02-01'),
        dueDate: new Date('2024-06-15'),
      },
    }),
    prisma.project.create({
      data: {
        userId: users[1].id,
        clientId: clients[2].id,
        name: 'System Integration Project',
        description: 'Integration of legacy systems with modern platform',
        status: 'completed',
        priority: 5,
        tags: ['integration', 'government', 'completed'],
        startDate: new Date('2023-09-01'),
        dueDate: new Date('2024-01-15'),
      },
    }),
  ]);

  console.log('✅ Created sample projects');

  // Create sample documents
  const documents = await Promise.all([
    prisma.document.create({
      data: {
        userId: users[0].id,
        projectId: projects[0].id,
        name: 'Acme Contract Q1-2024',
        originalName: 'contract_acme_q1_2024.pdf',
        type: 'contract',
        mimeType: 'application/pdf',
        size: 1024 * 512, // 512KB
        path: '/uploads/demo/contract_acme_q1_2024.pdf',
        tags: ['contract', 'legal', 'acme'],
        status: 'completed',
        confidence: 0.95,
        extracted: JSON.stringify({
          clientName: 'Acme Corporation',
          contractValue: 25000,
          startDate: '2024-01-01',
          endDate: '2024-06-30',
          terms: 'Net 30 days',
          parties: ['StructureClerk', 'Acme Corporation'],
        }),
      },
    }),
    prisma.document.create({
      data: {
        userId: users[0].id,
        projectId: projects[0].id,
        name: 'Invoice #ACM-001',
        originalName: 'invoice_acm_001.pdf',
        type: 'invoice',
        mimeType: 'application/pdf',
        size: 1024 * 256, // 256KB
        path: '/uploads/demo/invoice_acm_001.pdf',
        tags: ['invoice', 'acme', 'paid'],
        status: 'completed',
        confidence: 0.98,
        extracted: JSON.stringify({
          invoiceNumber: 'ACM-001',
          amount: 5000,
          dueDate: '2024-02-15',
          status: 'paid',
          items: [
            { description: 'Website Design', quantity: 1, price: 3000 },
            { description: 'Development Hours', quantity: 20, price: 100 },
          ],
        }),
      },
    }),
    prisma.document.create({
      data: {
        userId: users[1].id,
        projectId: projects[2].id,
        name: 'Technical Specifications',
        originalName: 'tech_specs_gouv.pdf',
        type: 'document',
        mimeType: 'application/pdf',
        size: 1024 * 2048, // 2MB
        path: '/uploads/demo/tech_specs_gouv.pdf',
        tags: ['technical', 'specifications', 'government'],
        status: 'completed',
        confidence: 0.89,
        extracted: JSON.stringify({
          documentType: 'Technical Specification',
          version: '2.1',
          lastUpdated: '2023-12-15',
          requirements: 47,
          complianceStandards: ['ISO 27001', 'NIST'],
        }),
      },
    }),
  ]);

  console.log('✅ Created sample documents');

  // Create sample audio notes
  const audioNotes = await Promise.all([
    prisma.noteAudio.create({
      data: {
        userId: users[0].id,
        projectId: projects[0].id,
        name: 'Client Call - Project Kickoff',
        path: '/uploads/demo/client_kickoff.webm',
        duration: 1800, // 30 minutes
        size: 1024 * 1024 * 15, // 15MB
        mimeType: 'audio/webm',
        language: 'en',
        confidence: 0.92,
        status: 'completed',
        transcript: JSON.stringify({
          text: 'Today we discussed the project requirements and timeline...',
          speakerDiarization: [
            { speaker: 'User', segments: ['0:00', '5:23', '12:45'] },
            { speaker: 'Client', segments: ['5:24', '8:12', '13:20'] },
          ],
        }),
        summary: JSON.stringify({
          mainPoints: [
            'Project scope confirmed',
            'Timeline agreed: 3 months',
            'Budget approved: $25,000',
            'Next steps: Mockup design',
          ],
          actionItems: [
            'Send mockup designs by Friday',
            'Schedule technical review call',
            'Prepare project charter',
          ],
          entities: {
            people: ['John Smith', 'Sarah Johnson'],
            dates: ['2024-01-15', '2024-01-19'],
            amounts: ['$25,000'],
          },
        }),
      },
    }),
  ]);

  console.log('✅ Created sample audio notes');

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        userId: users[0].id,
        projectId: projects[0].id,
        clientId: clients[0].id,
        title: 'Design homepage mockup',
        description: 'Create initial homepage design concepts based on client requirements',
        status: 'in_progress',
        priority: 4,
        dueDate: new Date('2024-01-25'),
        source: 'ai_generated',
        sourceId: audioNotes[0].id,
        tags: ['design', 'homepage', 'urgent'],
      },
    }),
    prisma.task.create({
      data: {
        userId: users[0].id,
        projectId: projects[0].id,
        title: 'Prepare project charter document',
        description: 'Draft and finalize project charter with scope and deliverables',
        status: 'open',
        priority: 3,
        dueDate: new Date('2024-01-22'),
        source: 'ai_generated',
        sourceId: audioNotes[0].id,
        tags: ['documentation', 'planning'],
      },
    }),
    prisma.task.create({
      data: {
        userId: users[0].id,
        title: 'Send weekly progress report',
        description: 'Compile and send weekly status update to client',
        status: 'open',
        priority: 2,
        dueDate: new Date('2024-01-26'),
        source: 'manual',
        tags: ['communication', 'weekly'],
      },
    }),
  ]);

  console.log('✅ Created sample tasks');

  // Create sample invoices
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        userId: users[0].id,
        clientId: clients[0].id,
        projectId: projects[0].id,
        invoiceNumber: 'INV-2024-001',
        amountCents: 500000, // $5,000.00
        taxCents: 65000, // $650.00 (13% QST)
        totalCents: 565000, // $5,650.00
        currency: 'CAD',
        status: 'sent',
        dueDate: new Date('2024-02-15'),
        items: JSON.stringify([
          {
            description: 'Website Design Services',
            quantity: 1,
            unitPriceCents: 300000, // $3,000.00
            totalCents: 300000,
          },
          {
            description: 'Development Hours (20 hours)',
            quantity: 20,
            unitPriceCents: 10000, // $100.00
            totalCents: 200000,
          },
        ]),
        notes: 'Payment terms: Net 30 days. Thank you for your business!',
        createdAt: new Date('2024-01-15'),
      },
    }),
    prisma.invoice.create({
      data: {
        userId: users[0].id,
        clientId: clients[1].id,
        invoiceNumber: 'INV-2024-002',
        amountCents: 750000, // $7,500.00
        taxCents: 97500, // $975.00
        totalCents: 847500, // $8,475.00
        currency: 'CAD',
        status: 'draft',
        dueDate: new Date('2024-03-01'),
        items: JSON.stringify([
          {
            description: 'Mobile App UX/UI Design',
            quantity: 1,
            unitPriceCents: 400000, // $4,000.00
            totalCents: 400000,
          },
          {
            description: 'Technical Architecture Planning',
            quantity: 1,
            unitPriceCents: 350000, // $3,500.00
            totalCents: 350000,
          },
        ]),
        notes: 'Draft invoice - pending client approval',
        createdAt: new Date('2024-01-20'),
      },
    }),
  ]);

  console.log('✅ Created sample invoices');

  // Create sample automation rules
  const automationRules = await Promise.all([
    prisma.automationRule.create({
      data: {
        userId: users[0].id,
        name: 'Invoice Payment Reminder',
        type: 'invoice_reminder',
        trigger: JSON.stringify({
          condition: 'invoice_overdue',
          days: 3,
        }),
        actions: JSON.stringify([
          { type: 'send_email', template: 'invoice_reminder' },
          { type: 'create_task', priority: 3 },
        ]),
        enabled: true,
      },
    }),
    prisma.automationRule.create({
      data: {
        userId: users[0].id,
        name: 'Weekly Task Review',
        type: 'scheduled_callback',
        trigger: JSON.stringify({
          type: 'schedule',
          cron: '0 9 * * 1', // Monday 9 AM
        }),
        actions: JSON.stringify([
          { type: 'create_summary_report' },
          { type: 'send_email', template: 'weekly_summary' },
        ]),
        enabled: true,
      },
    }),
  ]);

  console.log('✅ Created sample automation rules');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${users.length}`);
  console.log(`- Clients: ${clients.length}`);
  console.log(`- Projects: ${projects.length}`);
  console.log(`- Documents: ${documents.length}`);
  console.log(`- Audio Notes: ${audioNotes.length}`);
  console.log(`- Tasks: ${tasks.length}`);
  console.log(`- Invoices: ${invoices.length}`);
  console.log(`- Automation Rules: ${automationRules.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });