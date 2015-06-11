package test;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

public class HttpURLConnectionTest {
	
	public static final String DEBUG_TAG = "HttpURLConnectionTest";
	
	// Given a URL, establishes an HttpUrlConnection and retrieves
	// the web page content as a InputStream, which it returns as
	// a string.
	public static void downloadUrl(String myurl) throws IOException {
		HttpURLConnection conn = null;

	    try {
	        URL url = new URL(myurl);
	        conn = (HttpURLConnection) url.openConnection();
	        conn.setReadTimeout(10000 /* milliseconds */);
	        conn.setConnectTimeout(15000 /* milliseconds */);
	        conn.setRequestMethod("GET");
	        conn.setDoInput(true);
	        // Starts the query
	        conn.connect();
	        int response = conn.getResponseCode();
	        //Log.d(DEBUG_TAG, "The response is: " + response);
	        InputStream is = conn.getInputStream();

	        // Convert the InputStream into a string
	        BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));			
			String hasRead;
			while ((hasRead = br.readLine()) != null) {
				System.out.println(hasRead);
			}

	    } finally {
	        if (conn != null) {
	            conn.disconnect();
	        }
	    }
	}
	
	public static String excutePost(String targetURL, String urlParameters) {
		HttpURLConnection connection = null;
		
		try {
		    //Create connection
		    URL url = new URL(targetURL);
		    connection = (HttpURLConnection) url.openConnection();
		    connection.setRequestMethod("POST");
		    connection.setRequestProperty("Content-Type", 
		        "application/x-www-form-urlencoded");

		    connection.setRequestProperty("Content-Length", 
		        Integer.toString(urlParameters.getBytes().length));
		    connection.setRequestProperty("Content-Language", "en-US");  

		    connection.setUseCaches(false);
		    connection.setDoOutput(true);

		    //Send request
		    DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		    wr.writeBytes(urlParameters);
		    wr.close();

		    //Get Response  
		    InputStream is = connection.getInputStream();
		    BufferedReader rd = new BufferedReader(new InputStreamReader(is));
		    StringBuilder response = new StringBuilder(); // or StringBuffer if not Java 5+ 
		    String line;
		    while((line = rd.readLine()) != null) {
		      response.append(line);
		      response.append('\r');
		    }
		    rd.close();
		    return response.toString();
		} catch (Exception e) {
		    e.printStackTrace();
		    return null;
		} finally {
		    if(connection != null) {
		    	connection.disconnect();
		    }
		}
	}
	
	public static void main (String[] arg) throws IOException {
		downloadUrl("https://www.tenpay.com");
		String urlParameters = "test=" + URLEncoder.encode("hello starry", "UTF-8");
		System.out.print(excutePost("https://www.tenpay.com/app/v1.0/oneclick_deduct_services.cgi", urlParameters));
	}

}
