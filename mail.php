<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>email</title>
</head>
<body>

	    
<?php
           if (isset($_POST['email1']))
       //if "email," is filled out, send email
         {
          //send email
          $subject = "EarthMiles: Mail Form";
          $email = 'Email not Supplied';
          if(isset($_POST['email1'])) {
          $email = $_POST['email1'] ;
          }


          $message = '<html><body>';
          $message .= "<h1>$subject</h1>";
          $message .= "<Strong>Email ID: $email1 </Strong><br/>";
          $message .= '</body></html>';
      // To send HTML mail, the Content-type header must be set
       // $to = "EarthMiles: <info@earthmiles.co.uk>";
	   $to = "EarthMiles: <ersouravgarg@gmail.com>";

// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
 
     mail($to, $subject, $message, $headers);
    echo "<p>Thank you for contacting us.</p>";

}
else
{
?>	
<form method="post" action="<?php echo $_SERVER["PHP_SELF"];?>" class="form-inline" role="form">
		  <div class="form-group">
		    <label class="sr-only" for="exampleInputEmail2">Enter Your email</label>
		    <input type="email" for="mail" placeholder="Enter Your email" name="email1" id="email1" class="form-control btn-lg" >
		  </div>
		  <button type="submit" class="btn btn-primary">Send</button>
		</form>
<?php
}
?>
</body>
</html>
