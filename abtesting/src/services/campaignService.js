import { supabase } from '../supabaseClient';

// Get all campaigns for the current user
export const getCampaigns = async (userId) => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Get a single campaign by ID
export const getCampaignById = async (campaignId, userId) => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Create a new campaign
export const createCampaign = async (campaign, userId) => {
  const { data, error } = await supabase
    .from('campaigns')
    .insert([
      {
        ...campaign,
        user_id: userId,
        created_at: new Date().toISOString(),
        status: 'Active'
      }
    ])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Update an existing campaign
export const updateCampaign = async (campaignId, updates, userId) => {
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', campaignId)
    .eq('user_id', userId)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Delete a campaign
export const deleteCampaign = async (campaignId, userId) => {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', campaignId)
    .eq('user_id', userId);
  
  if (error) throw error;
  return true;
};

// Get results for a campaign
export const getCampaignResults = async (campaignId, userId) => {
  const { data, error } = await supabase
    .from('campaign_results')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
  return data;
};

// Save results for a campaign
export const saveCampaignResults = async (campaignId, results, userId) => {
  // Check if results already exist
  const existingResults = await getCampaignResults(campaignId, userId);
  
  if (existingResults) {
    // Update existing results
    const { data, error } = await supabase
      .from('campaign_results')
      .update({ results_data: results })
      .eq('campaign_id', campaignId)
      .eq('user_id', userId)
      .select();
    
    if (error) throw error;
    return data[0];
  } else {
    // Create new results
    const { data, error } = await supabase
      .from('campaign_results')
      .insert([
        {
          campaign_id: campaignId,
          user_id: userId,
          results_data: results
        }
      ])
      .select();
    
    if (error) throw error;
    return data[0];
  }
}; 