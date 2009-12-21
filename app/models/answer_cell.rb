class AnswerCell < ActiveRecord::Base
  belongs_to :answer

  named_scope :ratings, :conditions => ['answertype = ?', 'Rating']
  # named_scope :in_answer, lambda { |answer| { :conditions => ['answer_id = ?', answer.is_a?(Answer) ? answer.id : answer] } }
  named_scope :not_answered, :conditions => ["(value = ? OR value = NULL)", '9']
  named_scope :items, :conditions => ["item != ? ", ""]
  
  # attr_accessor :some_new_value

  def change_value(new_value, valid_values = {})
    new_value = new_value || ""
    some_value_changed = false
    if valid_values[:type].to_s =~ /Rating|SelectOption/   # if not valid, keep existing value
      new_value = "9" if new_value.blank?
      if new_value != self.value && valid_values[:values].include?(new_value)
        self.value, some_value_changed = new_value, true
      end
    else  # other types
      self.value, some_value_changed = CGI.escape(new_value), true if new_value != self.value  # TODO: escape value
    end
    return some_value_changed
  end
  
  # edit existing cells
  # def change_value(new_value, valid_values = {})
  #   new_value = new_value || ""
  #   some_value_changed = false
  #   if valid_values[:type].to_s =~ /Rating|SelectOption/   # if not valid, keep existing value
  #     new_value = "9" if new_value.blank?
  #     if new_value != self.value && valid_values[:values].include?(new_value)
  #       self.value, some_value_changed = new_value, true
  #     end
  #   else  # other types
  #     self.value, some_value_changed = CGI.escape(new_value), true if new_value != self.value  # TODO: escape value
  #   end
  #   if some_value_changed
  #     return self
  #   else
  #     return nil
  #   end
  # end
  
  def change_value!(new_value, valid_values = {})
    self.save if change_value(new_value, valid_values)
  end
  
  # comparison based on row first, then column
  def <=>(other)
    if self.row == other.row
      self.col <=> other.col
    else
      self.row <=> other.row
    end
  end

  def equal(cell)
  return (id = cell.id) && (answer_id == cell.answer_id) && (col == cell.col) && (row == cell.row) &&
    (item = cell.item) && (value = cell.value)
  end
  
  def to_xml
    t.column :answertype, :string, :limit => 20
    t.column :col, :int, :null => false
    t.column :row, :int, :null => false
    t.column :item, :string, :limit => 5
    t.column :value, :string
    xml = []
    xml << "<answer_cell answer_type='#{self.answertype}' col='#{self.col.to_s}' row='#{self.row.to_s}'>"
    xml << "  <item>#{self.item}</item>"
    xml << "  <value>#{self.value}</value>"
    xml << "</answer_cell>"
  end
end

class RatingAnswer < AnswerCell
end

class SelectOptionAnswer < AnswerCell
end

class CheckboxAnswer < AnswerCell
end