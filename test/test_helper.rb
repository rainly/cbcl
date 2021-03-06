ENV["RAILS_ENV"] = "test"
require File.expand_path(File.dirname(__FILE__) + "/../config/environment")
require 'test_help'
require 'active_support'

class ActiveSupport::TestCase
  # Transactional fixtures accelerate your tests by wrapping each test method
  # in a transaction that's rolled back on completion.  This ensures that the
  # test database remains unchanged so your fixtures don't have to be reloaded
  # between every test method.  Fewer database queries means faster tests.
  #
  # Read Mike Clark's excellent walkthrough at
  #   http://clarkware.com/cgi/blosxom/2005/10/24#Rails10FastTesting
  #
  # Every Active Record database supports transactions except MyISAM tables
  # in MySQL.  Turn off transactional fixtures in this case; however, if you
  # don't care one way or the other, switching from MyISAM to InnoDB tables
  # is recommended.
  #
  # The only drawback to using transactional fixtures is when you actually 
  # need to test transactions.  Since your test is bracketed by a transaction,
  # any transactions started in your code will be automatically rolled back.
  self.use_transactional_fixtures = true

  # Instantiated fixtures are slow, but give you @david where otherwise you
  # would need people(:david).  If you don't want to migrate your existing
  # test cases which use the @david style and don't mind the speed hit (each
  # instantiated fixtures translates to a database query per test method),
  # then set this back to true.
  self.use_instantiated_fixtures  = true

  # Setup all fixtures in test/fixtures/*.(yml|csv) for all tests in alphabetical order.
  #
  # Note: You'll currently still have to declare fixtures explicitly in integration tests
  # -- they do not yet inherit this setting
  fixtures :all

  # Add more helper methods to be used by all tests here...
  
  # Sets the current person in the session from the person fixtures.
  def self.login_as(person, &block)
    context "logged in as #{person}" do
      setup do
        @request    = ActionController::TestRequest.new 
        @response   = ActionController::TestResponse.new
        @request.session[:rbac_user_id] = users(person).id
      end
      context '' do
        yield
      end
    end
  end
  
  def assert_include(object, collection)
    assert collection.include?(object)
  end

  def assert_not_include(object, collection)
    assert !collection.include?(object)
  end
  
  # are all objects of subset in collection?
  def assert_all(subset, collection) 
    assert subset.all? { |obj| collection.include?(obj) }
  end

  def assert_none(subset, collection) 
    assert subset.all? { |obj| !collection.include?(obj) }
  end


  def assert_all_instance_of(klass, collection) 
    assert collection.all? { |obj| obj.instance_of? klass }
  end
  

end
