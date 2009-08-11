class LoginController < ApplicationController # ActiveRbac::ComponentController
  layout 'login'

  include LoginHelper
  
  # Displays the login form on GET and performs the login on POST. Expects the
  # Expects the "login" and "password" parameters to be set. Displays the #login
  # form on errors. The user must not be logged in.
  #
  # Checks the session entry <tt>return_to</tt> and the parameter 
  # <tt>return_to</tt> for information of where to redirect to after the login
  # has been performed successfully (in this order).
  #
  # Will write the value into the <tt>return_to</tt> session parameter if it
  # came from parameter and clear it after the login has been performed 
  # successfully.
  
  def index
    redirect_to 'login'
  end
  
  def login
    # Check that the user is not already logged in
    unless current_user.nil?
      user = User.find_with_credentials(params[:username], params[:password])
      flash[:notice] = "#{current_user.name}, du er allerede logget ind."
      
      if session[:rbac_user_id] and current_user.has_access? :login_user
        redirect_to survey_start_path
      else
        redirect_to main_path
      end
        #'active_rbac/login/already_logged_in'
        return
    end

    # Set the location to redirect to in the session if it was passed in through
    # a parameter and none is stored in the session.
    if session[:return_to].nil? and !params[:return_to].nil?
      session[:return_to] = params[:return_to] 
    end
    
    # Simply render the login form on everything but POST.
    # return unless request.method == :post

    # Handle the login request otherwise.
    @errors = Array.new

    # If login or password is missing, we can stop processing right away.
    raise ActiveRecord::RecordNotFound if params[:username].to_s.empty? or params[:password].to_s.empty?

    user = User.find_with_credentials(params[:username], params[:password])    # Try to log the user in.
    raise ActiveRecord::RecordNotFound if user.nil?    # Check whether a user with these credentials could be found.
    raise ActiveRecord::RecordNotFound unless User.state_allows_login?(user.state)    # Check that the user has the correct state
    write_user_to_session(user)    # Write the user into the session object.

    flash[:notice] = "Velkommen #{user.name}, du er logget ind."

    # show message on first login
    if user.created_at == user.last_logged_in_at
      flash[:notice] = "Husk at ændre dit password"
    end
    
    # TODO: DRY up. Duplicate from line 27
    # if user is superadmin, redirect to login_page. Post to this method with some special parameter
    if session[:rbac_user_id] and current_user.has_access? :login_user
      redirect_to survey_start_path
    else
      redirect_to main_url
    end

  rescue ActiveRecord::RecordNotFound
    # Add an error and let the action render normally.
    flash[:error] = 'Forkert brugernavn eller password' if params[:password]
    @errors << 'Ugyldigt brugernavn eller password!'
  end
  
  # Displays the logout confirmation form on GET and performs the logout on 
  # POST. Expects the "yes" parameter to be set. If this is the case, the 
  # user's authentication state is clear. If it is not the case, the use will
  # be redirected to '/'. User must be logged in
  def logout
    # Note: The check for the user to be logged in is in a verify above.
    # Simply render the login form on everything but POST.
    return unless request.method == :post

    # Do not log out if the user did not press the "Yes" button
    if params[:yes].nil?
      redirect_to main_url and return
      # return
    end

    # Otherwise delete the user from the session
    self.remove_user_from_session!

    # Render success template.
    flash[:notice] = "Du er blevet logget ud."
    redirect_to login_url
  end

  def shadow_logout
    set_current_user(shadow_user)
    remove_shadow_user
    flash[:notice] = "Du er blevet logget ind i din egen konto igen"
    redirect_to main_path
  end
  
  def shadow_login  
    #switch user
    to_user = User.find(params[:id])
    switch_user(current_user, to_user)
    
    #redirect to dashboard of user
    flash[:notice] = "Logget ind som en anden bruger"
    redirect_to main_url #(:controller => '/main', :index => :index)
  end

  
  protected

  def write_user_to_session(user)
    session[:rbac_user_id] = user.id
  end

  def remove_user_from_session!
    session[:rbac_user_id] = nil
  end

  # Redirects to the location stored in the <tt>return_to</tt> session 
  # entry and clears it if it is set or renders the template at the given
  # path.
  # Sets <tt>flash[:notice]</tt> to the first parameter if it redirects.
  def redirect_with_notice_or_render(notice, template)
    if session[:return_to].nil?
      render :template => template
    else
      flash[:notice] = notice
      redirect_to session[:return_to]
      session[:return_to] = nil
    end
  end

end