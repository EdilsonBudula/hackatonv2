import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const getBaseUrl = () => {
  // Check if running locally or in production
  if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
    return 'http://localhost:54321/functions/v1';
  }
  return `https://${projectId}.supabase.co/functions/v1`;
};

const BASE_URL = getBaseUrl();

export const api = {
  // Profile endpoints
  async saveProfile(userId: string, profile: any) {
    const response = await fetch(`${BASE_URL}/make-server-8ad5a8d4/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ userId, profile }),
    });

    if (!response.ok) {
      throw new Error('Failed to save profile');
    }

    return response.json();
  },

  async getProfile(userId: string) {
    const response = await fetch(`${BASE_URL}/make-server-8ad5a8d4/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  // Metrics endpoints
  async saveMetric(userId: string, metric: any) {
    const response = await fetch(`${BASE_URL}/make-server-8ad5a8d4/metrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ userId, metric }),
    });

    if (!response.ok) {
      throw new Error('Failed to save metric');
    }

    return response.json();
  },

  async getMetrics(userId: string) {
    const response = await fetch(`${BASE_URL}/make-server-8ad5a8d4/metrics/${userId}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }

    return response.json();
  },

  // Lab results endpoints
  async uploadLabResult(userId: string, fileName: string, fileData: string, analysis: any) {
    const response = await fetch(`${BASE_URL}/make-server-8ad5a8d4/lab-results/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ userId, fileName, fileData, analysis }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload lab result');
    }

    return response.json();
  },

  async getLabResults(userId: string) {
    const response = await fetch(`${BASE_URL}/make-server-8ad5a8d4/lab-results/${userId}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lab results');
    }

    return response.json();
  },

  // Voice notes endpoints
  async uploadVoiceNote(userId: string, audioData: string, transcript: string, analysis: any) {
    const response = await fetch(`${BASE_URL}/make-server-8ad5a8d4/voice-notes/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ userId, audioData, transcript, analysis }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload voice note');
    }

    return response.json();
  },

  async getVoiceNotes(userId: string) {
    const response = await fetch(`${BASE_URL}/make-server-8ad5a8d4/voice-notes/${userId}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voice notes');
    }

    return response.json();
  },

  // Clinical notes endpoints
  async saveClinicalNote(userId: string, note: any) {
    const response = await fetch(`${BASE_URL}/make-server-8ad5a8d4/clinical-notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ userId, note }),
    });

    if (!response.ok) {
      throw new Error('Failed to save clinical note');
    }

    return response.json();
  },

  async getClinicalNotes(userId: string) {
    const response = await fetch(`${BASE_URL}/make-server-8ad5a8d4/clinical-notes/${userId}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch clinical notes');
    }

    return response.json();
  },

  // Risk analysis endpoint
  async getRiskAnalysis(userId: string) {
    const response = await fetch(`${BASE_URL}/make-server-8ad5a8d4/risk-analysis/${userId}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch risk analysis');
    }

    return response.json();
  },
};