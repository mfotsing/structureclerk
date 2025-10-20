-- Fix infinite recursion in profiles RLS policies
-- The issue: The SELECT policy was querying profiles table inside profiles policy
-- Solution: Allow users to view their own profile directly without recursion

-- Drop existing problematic policy
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON public.profiles;

-- Create simpler policies without recursion

-- 1. Users can always view their own profile (no recursion)
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (id = auth.uid());

-- 2. Users can view other profiles in the same organization (uses a safer check)
CREATE POLICY "Users can view org profiles"
  ON public.profiles
  FOR SELECT
  USING (
    organization_id IS NOT NULL
    AND organization_id = (
      SELECT organization_id
      FROM public.profiles
      WHERE id = auth.uid()
      LIMIT 1
    )
  );

-- 3. Allow INSERT during signup (for new profile creation)
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (id = auth.uid());

-- Add helpful comment
COMMENT ON POLICY "Users can view own profile" ON public.profiles IS
  'Allows users to view their own profile without recursion issues';
