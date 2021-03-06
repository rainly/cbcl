class Variable < ActiveRecord::Base
  belongs_to :question
  belongs_to :survey
  validates_presence_of :var
  validates_presence_of :question
  validates_presence_of :survey
  validates_presence_of :col
  validates_presence_of :row
  validates_uniqueness_of :var
  # validates_uniqueness_of :survey, :scope => [:question, :col, :row], :message => 'A variable for this cell already exists'
  
  named_scope :and_survey, :include => :survey
  named_scope :and_question, :include => :question
  
  attr_accessor :short

  @@question_hash = nil
  @@survey_hash = nil
  
  # order in hash by hash[by][row][col], where by is by default survey_id or question_id
  def self.all_in_hash(options = {})
    by_id = options[:by] || 'survey_id'

    if by_id == 'question_id'
      return @@question_hash if @@question_hash
    else
      return @@survey_hash if @@survey_hash
    end
    
    vars = self.all(:order => "#{by_id}, row")    

    if by_id == 'question_id'
      vars.inject({}) do |h, elem|
        h[elem.question_id] = { elem.row => { elem.col => elem } } if !h.key? elem.question_id
        h[elem.question_id][elem.row] = { elem.col => elem } if !h[elem.question_id].key? elem.row
        h[elem.question_id][elem.row].merge!({ elem.col => elem })
        h
      end
    else
      vars.inject({}) do |h, elem|
        h[elem.survey_id] = { elem.row => { elem.col => elem } } if !h.key? elem.survey_id
        h[elem.survey_id][elem.row] = { elem.col => elem.var } if !h[elem.survey_id].key? elem.row
        h[elem.survey_id][elem.row].merge!({ elem.col => elem })
        h
      end
    end
  end
  
  def self.get_by_question(question, row, col)
    @@question_hash ||= self.all_in_hash({:by => 'question_id'})
    
    if (s = @@question_hash[question]) && (the_row = s[row]) # && (the_col = the_row[col])
      var = the_row[col]
    end
  end

  def self.get_by_survey(survey, row, col)
    @@survey_hash ||= self.all_in_hash
    
    if (q = @@survey_hash[question]) && (the_row = q[row]) # && (the_col = the_row[col])
      var = the_row[col]
    end
  end


end
