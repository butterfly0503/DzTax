<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://sk8.tech
 * @since      1.1.0
 *
 * @package    Wp_Rest_User
 * @subpackage Wp_Rest_User/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Wp_Rest_User
 * @subpackage Wp_Rest_User/public
 * @author     SK8Tech <support@sk8.tech>
 */
class Wp_Rest_User_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.1.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.1.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.1.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Add the endpoints to the API
	 */
	public function add_api_routes() {
		/**
		 * Handle Register User request.
		 */
		register_rest_route('wp/v2', 'users/register', array(
			'methods' => 'POST',
			'callback' => array($this, 'register_user'),
		));
		register_rest_route('wp/v2', 'users/login', array(
			'methods' => 'POST',
			'callback' => array($this, 'login_user'),
        ));
        register_rest_route('wp/v2', 'users/getcategories', array(
			'methods' => 'POST',
			'callback' => array($this, 'get_categories'),
        ));
        register_rest_route('wp/v2', 'users/createPaymentLink', array( //new method
			'methods' => 'POST',
			'callback' => array($this, 'create_payment_link'),
        ));
        
        register_rest_route('wp/v2', 'users/updatecategories', array(
			'methods' => 'POST',
			'callback' => array($this, 'update_categories'),
        ));
        
        
		register_rest_route('wp/v2', 'users/lostpassword', array(
			'methods' => 'POST',
			'callback' => array($this, 'lost_password'),
		));
		register_rest_route('wp/v2', 'users/lost-password', array(
			'methods' => 'POST',
			'callback' => array($this, 'lost_password'),
		));
    }
    public function GenerateChk($DotpayId, $DotpayPin, $ParametersArray)

    {
        $ParametersArray['id'] = $DotpayId;
    
        $CHkInputString =   $DotpayPin.
                            (isset($ParametersArray['api_version']) ? $ParametersArray['api_version'] : null).
                            (isset($ParametersArray['lang']) ? $ParametersArray['lang'] : null).
                            (isset($ParametersArray['id']) ? $ParametersArray['id'] : null).
                            (isset($ParametersArray['amount']) ? $ParametersArray['amount'] : null).
                            (isset($ParametersArray['currency']) ? $ParametersArray['currency'] : null).
                            (isset($ParametersArray['description']) ? $ParametersArray['description'] : null).
                            (isset($ParametersArray['control']) ? $ParametersArray['control'] : null).
                            (isset($ParametersArray['channel']) ? $ParametersArray['channel'] : null).
                            (isset($ParametersArray['url']) ? $ParametersArray['url'] : null).
                            (isset($ParametersArray['type']) ? $ParametersArray['type'] : null).
                            (isset($ParametersArray['buttontext']) ? $ParametersArray['buttontext'] : null).
                            (isset($ParametersArray['urlc']) ? $ParametersArray['urlc'] : null).
                            (isset($ParametersArray['firstname']) ? $ParametersArray['firstname'] : null).
                            (isset($ParametersArray['lastname']) ? $ParametersArray['lastname'] : null).
                            (isset($ParametersArray['email']) ? $ParametersArray['email'] : null).
                            (isset($ParametersArray['street']) ? $ParametersArray['street'] : null).
                            (isset($ParametersArray['street_n1']) ? $ParametersArray['street_n1'] : null).
                            (isset($ParametersArray['city']) ? $ParametersArray['city'] : null).
                            (isset($ParametersArray['postcode']) ? $ParametersArray['postcode'] : null).
                            (isset($ParametersArray['phone']) ? $ParametersArray['phone'] : null).
                            (isset($ParametersArray['country']) ? $ParametersArray['country'] : null).
                            (isset($ParametersArray['ignore_last_payment_channel']) ? $ParametersArray['ignore_last_payment_channel'] : null);
    
        return hash('sha256',$CHkInputString);
    }

	/**
	 * Get the user and password in the request body and Register a User
	 *
	 * @author Jack
	 *
	 * @since    1.1.0
	 *
	 * @param [type] $request [description]
	 *
	 * @return [type] [description]
	 */
	public function register_user($request = null) {

		$response = array();
		$parameters = $request->get_json_params();
		$login = sanitize_text_field($parameters['login']);
        $password = sanitize_text_field($parameters['password']);
        $privatePersonChosen=sanitize_text_field($parameters['privatePersonChosen']);

        $firstName = sanitize_text_field($parameters['firstName']);
        $lastName = sanitize_text_field($parameters['lastName']);
        $streetName = sanitize_text_field($parameters['streetName']);
        $houseNr = sanitize_text_field($parameters['houseNr']);
        $flatNr = sanitize_text_field($parameters['flatNr']);
        $zipCode = sanitize_text_field($parameters['zipCode']);
        $miejscowosc = sanitize_text_field($parameters['miejscowosc']);
        $city = sanitize_text_field($parameters['city']);


		$error = new WP_Error();

		if (empty($login)) {
			$error->add(400, __("Username field 'username' is required.", 'wp-rest-user'), array('status' => 400));
			return $error;
		}
		if (empty($password)) {
			$error->add(404, __("Password field 'password' is required.", 'wp-rest-user'), array('status' => 400));
			return $error;
		}


		$user_id = username_exists($login);
		if (!$user_id ) {
            $email="dummy@gmail.com";
            $user_id = wp_create_user($login, $password, $email);

            if(!$privatePersonChosen){
                $nip=sanitize_text_field($parameters['nip']);
                $companyName=sanitize_text_field($parameters['companyName']);
                $data = array(
                    'firstName' => $firstName, 
                    'lastName' => $lastName,
                    'streetName' => $streetName,
                    'houseNr' => $houseNr,
                    'flatNr' => $flatNr,
                    'zipCode' => $zipCode,
                    'miejscowosc' => $miejscowosc,
                    'city' => $city,
                    'nip' => $nip,
                    'companyName' => $companyName
                );
                update_user_meta( $user_id, 'info', $data );
            }
            else{
                $data = array(
                    'firstName' => $firstName, 
                    'lastName' => $lastName,
                    'streetName' => $streetName,
                    'houseNr' => $houseNr,
                    'flatNr' => $flatNr,
                    'zipCode' => $zipCode,
                    'miejscowosc' => $miejscowosc,
                    'city' => $city,
                );
                update_user_meta( $user_id, 'info', $data );
            }
            $categoriesList=array();
            update_user_meta( $user_id, 'categories', $categoriesList );
            $paymentsList=null;
            update_user_meta( $user_id, 'payment', $paymentsList );

			if (!is_wp_error($user_id)) {
				// Ger User Meta Data (Sensitive, Password included. DO NOT pass to front end.)
				$user = get_user_by('id', $user_id);
				do_action('wp_rest_user_create_user', $user); // Deprecated
				do_action('wp_rest_user_user_register', $user);

				// Ger User Data (Non-Sensitive, Pass to front end.)
				$userinfo=get_user_meta( $user_id, 'info');
                $response['code'] = 200;
                $response['userinfo'] = $userinfo;
				$response['success'] = true;
				$response['message'] = __("User '" . $login . "' Registration was Successful", "wp-rest-user");
			} else {
				return $user_id;
			}
		} else {
			$response['code'] = 300;
			$response['success'] = false;
			$response['reason'] = 0;//user already exists
		} 

		return new WP_REST_Response($response, 200);
	}
	
		public function login_user($request = null) {

		$response = array();
		$parameters = $request->get_json_params();
		$login = sanitize_text_field($parameters['login']);
		$password = sanitize_text_field($parameters['password']);
		$error = new WP_Error();

		if (empty($login)) {
			$error->add(400, __("Login field 'Login' is required.", 'wp-rest-user'), array('status' => 400));
			return $error;
		}
		if (empty($password)) {
			$error->add(404, __("Password field 'password' is required.", 'wp-rest-user'), array('status' => 400));
			return $error;
		}

		$user_id = username_exists($login);
		$user = get_user_by('id', $user_id);
		$isCorret=wp_check_password($password, $user->data->user_pass);
		
		if ($user_id && $isCorret) {

			$response['code'] = 200;
			$response['id'] = $user_id; 
			$response['success'] = true;

		} else 
		{
			if (!$user_id) {
				$response['code'] = 300;
				$response['reason'] = 0;//wrong username
				$response['success'] = false;
			} else {
			$response['code'] = 300;
			$response['reason'] = 1;//wrong password
			$response['success'] = false;
			}
		}


		return new WP_REST_Response($response, 200);
    }
    public function create_payment_link($request = null) {

		$response = array();
		$parameters = $request->get_json_params();
		$login = sanitize_text_field($parameters['login']);
        $password = sanitize_text_field($parameters['password']);
        $months = $parameters['months'];
		$error = new WP_Error();

		if (empty($login)) {
			$error->add(400, __("Login field 'Login' is required.", 'wp-rest-user'), array('status' => 400));
			return $error;
		}
		if (empty($password)) {
			$error->add(404, __("Password field 'password' is required.", 'wp-rest-user'), array('status' => 400));
			return $error;
		}

		$user_id = username_exists($login);
		$user = get_user_by('id', $user_id);
		$isCorret=wp_check_password($password, $user->data->user_pass);
		
		if ($user_id && $isCorret) {
            
            $paymentObject=get_user_meta( $user_id, 'payment',true);
            // $error->add(404, __("Our obj is " . $paymentObject . ' this', 'wp-rest-user'), array('status' => 400));
			// return $error;
            if($paymentObject==null){
            
                $newObj = new stdClass;
                $currDate= new DateTime();
                
                $newObject->startDate =$currDate ;
                $monthString='+ ' . $months . ' month';
                $nextDate = clone($currDate);
                $nextDate = $nextDate->modify($monthString);
                $newObject->endDate =$nextDate ;
                $newObject->paid =false ;
                update_user_meta( $user_id, 'payment', $newObject );
                $response['code'] = 200;
            }
            else{ //we need to take last element
                $oldObject= clone($paymentObject);
                $oldObject->paid =false ;
                $oldDate=$oldObject->endDate;
                $monthString='+ ' . $months . ' month';
                $nextDate = $oldDate->modify($monthString);
                $oldObject->endDate = $nextDate;
                update_user_meta( $user_id, 'payment', $oldObject);
                $response['code'] = 201;
                //
            }
            
            $DotpayId='719800';
            $DotpayPin='1OH57LUVDn9ucx3CivqisyN8KEggYPXa';
            
            $Environment='test';
            if ($Environment == 'production') {
                $EnvironmentAddress = 'https://ssl.dotpay.pl/t2/';
            } elseif ($Environment == 'test') {
                $EnvironmentAddress = 'https://ssl.dotpay.pl/test_payment/';
            }
			$price=$months*100;
            $ParametersArray = array(

                "api_version" => "dev",
                "amount" => $price . '.00',
                "currency" => "PLN",
                "description" => 'Ekarta-' . $months . '-miesiace',
                "urlc" => "https://tutorieapi.herokuapp.com/users/testdotpay",
                "control" => $user_id,
                "country" => "POL",
            );
            $MultiMerchantList = array(); //optional data
			$ChkValue = $this->GenerateChk($DotpayId, $DotpayPin, $ParametersArray);
			$link =$EnvironmentAddress . "?id=" . $DotpayId . "&chk=" . $ChkValue . "&amount=" . 
			$price . '.00&country=POL&currency=PLN&description=Ekarta-' . $months . 
			'-miesiace&api_version=dev&urlc=https://tutorieapi.herokuapp.com/users/testdotpay&control=' . $user_id;
            $response['link'] = $link;
            $addedObj=get_user_meta( $user_id, 'payment');
            $response['payment'] = $addedObj;
            $response['id'] = $user_id; 
            $response['success'] = true;
        } 
        else 
		{
			if (!$user_id) {
				$response['code'] = 300;
				$response['reason'] = 0;//wrong username
				$response['success'] = false;
			} else {
			$response['code'] = 300;
			$response['reason'] = 1;//wrong password
			$response['success'] = false;
			}
		}


		return new WP_REST_Response($response, 200);
    }
    public function get_categories($request = null) {

		$response = array();
		$parameters = $request->get_json_params();
		$login = sanitize_text_field($parameters['login']);
		$password = sanitize_text_field($parameters['password']);
		$error = new WP_Error();

		if (empty($login)) {
			$error->add(400, __("Login field 'Login' is required.", 'wp-rest-user'), array('status' => 400));
			return $error;
		}
		if (empty($password)) {
			$error->add(404, __("Password field 'password' is required.", 'wp-rest-user'), array('status' => 400));
			return $error;
		}

		$user_id = username_exists($login);
		$user = get_user_by('id', $user_id);
		$isCorret=wp_check_password($password, $user->data->user_pass);
		
		if ($user_id && $isCorret) {
            $response['categories'] = get_user_meta( $user_id, 'categories');
			$response['code'] = 200;
			$response['id'] = $user_id; 
			$response['success'] = true;

		} else 
		{
			if (!$user_id) {
				$response['code'] = 300;
				$response['reason'] = 0;//wrong username
				$response['success'] = false;
			} else {
			$response['code'] = 300;
			$response['reason'] = 1;//wrong password
			$response['success'] = false;
			}
		}


		return new WP_REST_Response($response, 200);
    }
    public function update_categories($request = null) {

		$response = array();
		$parameters = $request->get_json_params();
		$login = sanitize_text_field($parameters['login']);
        $password = sanitize_text_field($parameters['password']);
        $categoriesList=$parameters['categories'];
		$error = new WP_Error();

		if (empty($login)) {
			$error->add(400, __("Login field 'Login' is required.", 'wp-rest-user'), array('status' => 400));
			return $error;
		}
		if (empty($password)) {
			$error->add(404, __("Password field 'password' is required.", 'wp-rest-user'), array('status' => 400));
			return $error;
		}

		$user_id = username_exists($login);
		$user = get_user_by('id', $user_id);
		$isCorret=wp_check_password($password, $user->data->user_pass);
		
		if ($user_id && $isCorret) {
            update_user_meta( $user_id, 'categories', $categoriesList );
            $response['aktualne'] = get_user_meta( $user_id, 'categories');
			$response['code'] = 200;
			$response['success'] = true;

		} else 
		{
			if (!$user_id) {
				$response['code'] = 300;
				$response['reason'] = 0;//wrong username
				$response['success'] = false;
			} else {
			$response['code'] = 300;
			$response['reason'] = 1;//wrong password
			$response['success'] = false;
			}
		}


		return new WP_REST_Response($response, 200);
	}
	


	/**
	 * Get the username or email in the request body and Send a Forgot Password email
	 *
	 * @author Jack
	 *
	 * @since    1.3.0
	 *
	 * @param [type] $request [description]
	 *
	 * @return [type] [description]
	 */
	public function lost_password($request = null) {

		$response = array();
		$parameters = $request->get_json_params();
		$user_login = sanitize_text_field($parameters['user_login']);
		$error = new WP_Error();

		if (empty($user_login)) {
			$error->add(400, __("The field 'user_login' is required.", 'wp-rest-user'), array('status' => 400));
			return $error;
		} else {
			$user_id = username_exists($user_login);
			if ($user_id == false) {
				$user_id = email_exists($user_login);
				if ($user_id == false) {
					$error->add(401, __("User '" . $user_login . "' not found.", 'wp-rest-user'), array('status' => 401));
					return $error;
				}
			}
		}

		// run the action
		// ==============================================================
		//do_action('retrieve_password', $user_login);
		$user = null;
		$email = "";
		if (strpos($user_login, '@')) {
			$user = get_user_by('email', $user_login);
			$email = $user_login;
		} else {
			$user = get_user_by('login', $user_login);
			$email = $user->user_email;
		}
		$key = get_password_reset_key($user);
		$rp_link = '<a href="' . site_url() . "/wp-login.php?action=rp&key=$key&login=" . rawurlencode($user->user_login) . '">' . site_url() . "/wp-login.php?action=rp&key=$key&login=" . rawurlencode($user->user_login) . '';

		function wpdocs_set_html_mail_content_type() {
			return 'text/html';
		}
		add_filter('wp_mail_content_type', 'wpdocs_set_html_mail_content_type');
		$email_successful = wp_mail($email, 'Reset password', 'Click here in order to reset your password:<br><br>' . $rp_link);
		// Reset content-type to avoid conflicts -- https://core.trac.wordpress.org/ticket/23578
		remove_filter('wp_mail_content_type', 'wpdocs_set_html_mail_content_type');
		// ==============================================================

		if ($email_successful) {
			$response['code'] = 200;
			$response['message'] = __("Reset Password link has been sent to your email.", "wp-rest-user");
		} else {
			$error->add(402, __("Failed to send Reset Password email. Check your WordPress Hosting Email Settings.", 'wp-rest-user'), array('status' => 402));
			return $error;
		}

		return new WP_REST_Response($response, 200);
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.1.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Wp_Rest_User_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Wp_Rest_User_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/wp-rest-user-public.css', array(), $this->version, 'all');

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.1.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Wp_Rest_User_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Wp_Rest_User_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/wp-rest-user-public.js', array('jquery'), $this->version, false);

	}

}
