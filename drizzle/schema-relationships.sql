-- Email tracking and relationship intelligence schema

-- Email messages (synced from Gmail/Outlook)
CREATE TABLE IF NOT EXISTS email_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message_id VARCHAR(255) NOT NULL UNIQUE,
  thread_id VARCHAR(255),
  from_email VARCHAR(320) NOT NULL,
  to_emails TEXT NOT NULL, -- JSON array
  cc_emails TEXT,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  sent_at TIMESTAMP NOT NULL,
  received_at TIMESTAMP,
  is_sent BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  labels TEXT, -- JSON array
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_sent (user_id, sent_at),
  INDEX idx_thread (thread_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Key relationships (people the user cares about)
CREATE TABLE IF NOT EXISTS key_relationships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(320) NOT NULL,
  contact_phone VARCHAR(50),
  relationship_type VARCHAR(50), -- 'investor', 'partner', 'mentor', 'client', 'family', 'friend'
  importance_level INT DEFAULT 5, -- 1-10 scale
  min_contact_frequency INT DEFAULT 7, -- days between contacts
  last_contact_date TIMESTAMP,
  total_interactions INT DEFAULT 0,
  notes TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_importance (user_id, importance_level),
  INDEX idx_last_contact (last_contact_date),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Communication events (emails, calls, meetings)
CREATE TABLE IF NOT EXISTS communication_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  relationship_id INT,
  event_type VARCHAR(50) NOT NULL, -- 'email_sent', 'email_received', 'call', 'meeting', 'text'
  contact_email VARCHAR(320),
  contact_name VARCHAR(255),
  subject TEXT,
  summary TEXT,
  sentiment VARCHAR(20), -- 'positive', 'neutral', 'negative'
  event_date TIMESTAMP NOT NULL,
  duration INT, -- minutes for calls/meetings
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_date (user_id, event_date),
  INDEX idx_relationship (relationship_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (relationship_id) REFERENCES key_relationships(id)
);

-- Relationship insights (AI-generated)
CREATE TABLE IF NOT EXISTS relationship_insights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  relationship_id INT,
  insight_type VARCHAR(50) NOT NULL, -- 'cold_connection', 'frequent_contact', 'sentiment_change', 'opportunity'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  action_suggested TEXT,
  is_actioned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_priority (user_id, priority),
  INDEX idx_relationship (relationship_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (relationship_id) REFERENCES key_relationships(id)
);

-- Calendar events (synced from Google Calendar/Outlook)
CREATE TABLE IF NOT EXISTS calendar_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  location VARCHAR(500),
  attendees TEXT, -- JSON array
  event_type VARCHAR(50), -- 'meeting', 'call', 'focus_time', 'personal'
  is_all_day BOOLEAN DEFAULT FALSE,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_time (user_id, start_time),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Behavioral patterns detected by AI
CREATE TABLE IF NOT EXISTS behavioral_patterns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  pattern_type VARCHAR(50) NOT NULL, -- 'communication_spike', 'isolation', 'stress_indicators', 'productivity_drop'
  pattern_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  confidence INT NOT NULL, -- 0-100
  first_detected TIMESTAMP NOT NULL,
  last_detected TIMESTAMP NOT NULL,
  occurrences INT DEFAULT 1,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_type (user_id, pattern_type),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
