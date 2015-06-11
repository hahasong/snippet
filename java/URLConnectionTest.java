package test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

public class URLConnectionTest {
	public static void main (String[] arg) throws IOException {
		BufferedReader br = null;
		try {
			URL url = new URL("https://www.tenpay.com");
			URLConnection connection = url.openConnection();
			InputStream in = connection.getInputStream();
			br = new BufferedReader(new InputStreamReader(in));
			
			String hasRead;
			while ((hasRead = br.readLine()) != null) {
				System.out.println(hasRead);
			}
			
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (br != null)
			{
				br.close();
			}
		}
	}

}
