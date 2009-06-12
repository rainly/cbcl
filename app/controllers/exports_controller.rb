class ExportsController < ApplicationController

  def index
    args = params
    # set default dates
    params[:start_date] ||= SurveyAnswer.first.created_at
    params[:stop_date] ||= SurveyAnswer.last.created_at

    params = filter_date(args)
    @start_date, @stop_date = params[:start_date], params[:stop_date]

    # filter age
    @start_age = params[:age_start] = 1
    @stop_age = params[:age_stop]  = 21
    params = filter_age(args)

    @surveys = current_user.subscribed_surveys
    
    # set default value to true unless filter is pressed
    @surveys = surveys_default_selected(@surveys, params[:surveys])
    filter_surveys = @surveys.inject([]) { |col, s| col << s.id if s.selected; col }
    @survey_answers = current_user.survey_answers(params.merge({:surveys => filter_surveys})).compact
    puts "export_controller index COUNT SAS: #{@survey_answers.size}"
  end

  def filter
    args = params
    params = filter_date(args)
    @start_date, @stop_date = params[:start_date], params[:stop_date]
    @surveys = current_user.subscribed_surveys
    params = filter_age(params)
    
    # set default value to true unless filter is pressed
    @surveys = Survey.selected(params[:surveys].keys)
    @survey_answers = current_user.survey_answers(filter_date(params).merge({:surveys => @surveys})).compact
    
    render :update do |page|
      # page.replace 'survey_answer_list', :partial => "survey_answer_list"
      page.replace_html 'results', "Antal: #{@survey_answers.size.to_s}"
      # page.visual_effect :pulsate, 'results'
      page.visual_effect :shake, 'results'
      # page.visual_effect :highlight, 'survey_answer_list'
    end
  end


  # TODO: DRY up parameter processing (filtering)
  def download
    args = params
    params = filter_date(args)
    params = filter_age(params)

    @surveys = current_user.subscribed_surveys
    
    # set default value to true unless filter is pressed
    @surveys = Survey.selected(params[:surveys].keys)
    @survey_answers = current_user.survey_answers(filter_date(params).merge({:surveys => @surveys})).compact
    @journal_entries = @survey_answers.map {|sa| sa.journal_entry_id }
    puts "export_controller download COUNT SAS: #{@survey_answers.size}"
    puts "export_controller download COUNT JES: #{@journal_entries.size}"

    # spawns background task
    @task = Task.create(:status => "In progress")
    @task.create_export(@surveys.map(&:id), @journal_entries)

    redirect_to :action => :generating_export, :id => @task
  end
  
  # a periodic updater should check the progress of the export data generation 
  def generating_export
    @task = Task.find(params[:id])
    
    respond_to do |format|
      format.js {
        render :update do |page|
          if @task.completed?
            page.redirect_to :controller => 'export_file', :action => :show, :id => @task.export_file, :content_type => 'application/javascript'
          else
            page.update_progress
          end
        end
      }
      format.html do
        if @task.completed?
          redirect_to export_files(@task.export_file) #:controller => 'export_file', :action => :show, :id => @task.export_file
        else
          render
        end
      end
    end
  end
  
  def show_range
    @start_date = Date.civil(params[:range][:"start_date(1i)"].to_i,params[:range][:"start_date(2i)"].to_i,params[:range][:"start_date(3i)"].to_i)
  end
  
  def set_age_range
    @start_age = params[:age][:start].to_i
    @stop_age  = params[:age][:stop].to_i

    render :update do |page|
      if @start_age > @stop_age
        params[:id] == "up" ? @stop_age = @start_age : @start_age = @stop_age

        page.replace_html 'select_age', :partial => 'select_age', :locals => {:start_age => @start_age, :stop_age => @stop_age}
        page.visual_effect :highlight, 'stop_age'
        page.visual_effect :highlight, 'start_age'
      end
      # page.hide 'filter_form'
    end
  end

  
  protected
  
  def filter_date(args)
    if args[:start_date] && args[:stop_date]
      start = args.delete(:start_date)
      stop  = args.delete(:stop_date)
    end
    
    if start.is_a?(Time) and stop.is_a?(Time)
      args[:start_date] = start
      args[:stop_date] = stop
    elsif start.is_a?(Date) and stop.is_a?(Date)
      args[:start_date] = start.to_time
      args[:stop_date] = stop.to_time
    else
      {:start_date => start, :stop_date => stop}.each_pair do |key, date|
        unless date.blank?
          y = date[:year].to_i
          m = date[:month].to_i
          d = date[:day].to_i
          args[key] = Date.new(y, m, d).to_time
        end
      end
    end
    return args
  end
  
  def filter_age(args)
    args[:age_start] ||= 1
    args[:age_stop] ||= 21

    if args[:age] && (start_age = args[:age][:start].to_i) && (stop_age = args[:age][:stop].to_i)
      if start_age <= stop_age
        args[:age_start] = start_age
        args[:age_stop] = stop_age
      else
        args[:age_start] = stop_age
        args[:age_stop] = start_age
      end
    end
    return args
  end
  
  def surveys_default_selected(surveys, params)
    if selected = params
      surveys.each { |s| s.selected = (selected["#{s.id}"] == "1") }
    else
      surveys.each { |s| s.selected = true }
    end
    return surveys
  end
  
end