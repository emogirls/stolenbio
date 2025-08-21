import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eunktufcvnarizlnrfej.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bmt0dWZjdm5hcml6bG5yZmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDIzNTcsImV4cCI6MjA3MDE3ODM1N30.YPhd7abpLcK3zSAP1tWPi0K0jRotu3E8RS2hzlmi9vg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock invite codes for development
const VALID_INVITE_CODES = [
  'WELCOME1', 'BETA2024', 'EARLY001', 'TESTCODE', 'DEMO123', 
  'STOLEN1', 'BIO2024', 'ALPHA001'
]

export const validateInviteCode = (code: string): boolean => {
  return VALID_INVITE_CODES.includes(code.toUpperCase())
}