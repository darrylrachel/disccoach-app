import { supabase } from './supabaseClient'
import type { Database } from '../types/database.types'

type FeedbackCategory = 'bug' | 'feature_request' | 'general'
type FeedbackInsert = Database['public']['Tables']['feedback']['Insert']

export interface NewFeedbackInput {
  category: FeedbackCategory
  message: string
}

export async function submitFeedback(userId: string, input: NewFeedbackInput): Promise<void> {
  const payload: FeedbackInsert = {
    user_id: userId,
    category: input.category,
    message: input.message,
  }

  const { error } = await supabase.from('feedback').insert(payload)
  if (error) throw error
}
