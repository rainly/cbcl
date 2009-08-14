class JournalEntry < ActiveRecord::Base
  belongs_to :journal, :touch => true
  belongs_to :survey
  belongs_to :survey_answer, :dependent => :destroy, :touch => true
  belongs_to :login_user, :class_name => "LoginUser", :foreign_key => "user_id", :dependent => :destroy  # TODO: rename to login_user, add type constraint

  validates_associated :login_user
  
  named_scope :and_survey_answer, :include => [:survey, :survey_answer]
  named_scope :with_surveys, lambda { |survey_ids| { :joins => :survey_answer,
   :conditions => ["survey_answers.survey_id IN (?)", survey_ids] } }
  named_scope :for_surveys, lambda { |survey_ids| { :conditions => ["survey_id IN (?)", survey_ids] } }
  named_scope :answered, :conditions => ['state = ?', 5]
  
  def make_survey_answer
    self.survey_answer ||= self.build_survey_answer(:survey => self.survey,
                             :sex => self.journal.sex,
                             :age => self.journal.sex,
                             :nationality => self.journal.nationality,
                             :journal_entry_id => self.id)
    self.survey_answer
  end
  
  # deletes login user
  def remove_login!
    return self.login_user.destroy if self.login_user
    return false
  end
  
  def valid_for_csv?
    if survey_answer_id && survey_id && journal_id && answered?
      return self
    else
      return nil
    end
  end
  
  # increment subscription count, deletes login-user
  # 19-9 find better name
  def increment_subscription_count(survey_answer)
    self.survey_answer = survey_answer
    self.answered_at = Time.now
    center = self.journal.center
    
    # find subscription to increment, must be same as is journal_entry
    subscription = center.get_subscription(survey_answer.survey_id)  #s.detect { |sub| sub.survey.id == survey.id }
    return false if subscription.nil?                               # no abbo exists
    if subscription.copy_used!
      self.user_id = nil if (not self.user_id.nil?) && (User.destroy self.user_id)  # remove login
    end
    answered!    # saves objects
  end
  
  def create_login_user
    params = LoginUser.login_name_params(:prefix => self.journal.center.title)
    self.build_login_user(params)
    # puts "CREATE_LOGIN_USER 2 - built login user: #{self.login_user.inspect}    journal_entry: #{self.inspect}"
    self.login_user.center = self.journal.center
    # puts "CREATE_LOGIN_USER 3 - set center login_user: #{self.login_user.inspect}"
    Rails.cache.delete("role_behandler")
    self.login_user.roles << Role.get(:login_bruger)
    # puts "CREATE_LOGIN_USER 4 - adding role: #{self.login_user.inspect}"
    self.login_user.groups << self.journal
    # set password explicitly, it's protected
    pw = PasswordService.generate_password
    self.login_user.password, self.login_user.password_confirmation = pw.values
    # puts "CREATE_LOGIN_USER 7 - set password: #{self.login_user.inspect}"
    self.login_user.password_hash_type = "md5"
    self.login_user.last_logged_in_at = 10.years.ago
    # puts "CREATE_LOGIN_USER 8 - last: #{self.login_user.inspect} "
    # self.login_user.save # REMOVE
    # get clear password before saving&encrypting password
    # self.login_user.save!
    # puts "CREATE_LOGIN_USER 8.5 - SAVED login_user"
    self.password = pw[:password]
    # puts "CREATE_LOGIN_USER 9 - valid?: #{self.login_user.valid?} new_record? #{self.login_user.new_record?}"
    # self.save
    puts "CREATE_LOGIN_USER 9 - entry valid?: #{self.valid?}   errors: #{self.errors.inspect}"
    return self.login_user
    
  rescue => e
    puts "journal_entry.create_login_user: #{e.inspect}"
  end
  
  def status
    JournalEntry.states.invert[self.state]
  end
  
  def answered?
    self.state == JournalEntry.states['Besvaret']  # Besvaret
  end
  
  def answered!
    self.state = JournalEntry.states['Besvaret']   # Besvaret
    self.save!
  end

  def not_answered?
    self.state != JournalEntry.states['Besvaret'] # Ubesvaret
  end
  
  def not_answered!
    self.state = JournalEntry.states['Ubesvaret']   # Ubesvaret
    self.save!
  end
  
  def draft?
    self.state == JournalEntry.states['Svarkladde']  # Svarkladde er påbegyndt
  end
  
  def draft!
    self.state = JournalEntry.states['Kladde']   # Svarkladde
    self.save!
  end

  def awaiting_answer?
    self.state == JournalEntry.states['Venter']  # Venter
  end

  def awaiting_answer
    self.state = JournalEntry.states['Venter']   # Venter
  end
  
  def awaiting_answer!
    self.state = JournalEntry.states['Venter'] # 'Venter'
    self.save!
  end
  
  def print_login?
    self.state == print_login
  end

  def print_login
    self.state = JournalEntry.states['Sendt ud'] # print eller skal sendes
  end
  
  def print_login!
    self.print_login
    puts "entry.print_login!: #{self.inspect}  valid? #{self.valid?}"
    self.save!
  rescue => e
    puts "JournalEntry.print_login!: #{e.inspect}"
  end
  
  # reset state unless it has been answered
  def remove_login_user!
    self.user = nil    # set to unanswered unless answered
    self.state = JournalEntry.states[JournalEntry.states.invert[1]] unless self.state == JournalEntry.states[JournalEntry.states.invert[4]]
    self.save!
  end
  
  def JournalEntry.states  # ikke besvaret, besvaret, venter på svar (login-user)
    { 'Fejl'       => 0,
      'Ubesvaret'  => 1,
      'Sendt ud'   => 2,
      'Venter'     => 3,   # venter paa at login-bruger svarer paa skemaet
      'Kladde'     => 4,
      'Besvaret'   => 5,    # skemaet er printet, skift til venter

       }
  end
end
