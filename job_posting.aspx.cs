using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.Text;
using System.IO;
using HtmlAgilityPack;

public partial class job_posting : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // submit username/password to http://www.nscc.ca/Services/Graduate_Employment_Services/index.asp
        // fields: EmailAddress, Password
        // values: employment, nsccges07

        string url = "http://www.nscc.ca/Services/Graduate_Employment_Services/index.asp";

        // do a simple GET on index.asp to get an ASPSESSIONID
        HttpWebRequest get = (HttpWebRequest)WebRequest.Create(url);
        get.Method = "GET";

        HttpWebResponse getr = (HttpWebResponse)get.GetResponse();
        string cookie = getr.Headers["Set-Cookie"];
        if (!String.IsNullOrEmpty(cookie))
        {
            cookie = cookie.Substring(0, cookie.IndexOf(';'));
        }

        string postString = "EmailAddress=employment&Password=nsccges07&OK=Login";
        byte[] postData = Encoding.ASCII.GetBytes(postString);

        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        request.Method = "POST";
        request.ContentType = "application/x-www-form-urlencoded";
        request.Headers.Add(HttpRequestHeader.Cookie, cookie);
        request.Referer = url;
        request.ContentLength = postData.Length;

        Stream requestStream = request.GetRequestStream();
        requestStream.Write(postData, 0, postData.Length);
        requestStream.Close();

        HttpWebResponse response = (HttpWebResponse)request.GetResponse();
        Stream responseStream = response.GetResponseStream();
        StreamReader responseReader = new StreamReader(responseStream);
        string responseText = responseReader.ReadToEnd();
        responseReader.Close();
        responseStream.Close();
        response.Close();

        url = "http://www.nscc.ca/Services/Graduate_Employment_Services/Grad_Employ_Full.asp";

        // now go to listing of jobs page
        HttpWebRequest jobRequest = (HttpWebRequest)WebRequest.Create(url);
        jobRequest.Method = "GET";
        jobRequest.Headers.Add(HttpRequestHeader.Cookie, cookie);

        HttpWebResponse jobResponse = (HttpWebResponse)jobRequest.GetResponse();

        Stream jobResponseStream = jobResponse.GetResponseStream();
        StreamReader jobResponseReader = new StreamReader(jobResponseStream);
        string jobResponseText = jobResponseReader.ReadToEnd();
        jobResponseReader.Close();
        jobResponseStream.Close();
        jobResponse.Close();

        HtmlDocument doc = new HtmlDocument();
        doc.LoadHtml(jobResponseText);

        HtmlNode contentdiv = doc.DocumentNode.SelectSingleNode("//div[@id='content']");

        // remove divs at top of list
        contentdiv.SelectSingleNode("div[@id='cookietrail']").Remove();
        contentdiv.SelectSingleNode("div[@class='WidgetMenu']").Remove();

        // remove javascript tags
        foreach (HtmlNode jnode in contentdiv.SelectNodes("script"))
	    {
            jnode.Remove();
        }

        // remove divs at bottom of list
        contentdiv.RemoveChild(contentdiv.SelectSingleNode("div[@id='divPageRatingWidget']"));

        // remove comment tags
        foreach (HtmlNode cnode in contentdiv.SelectNodes("comment()"))
        {
            cnode.Remove();
        }

        // remove all View Details links
        foreach (HtmlNode viewdetailsnode in contentdiv.SelectNodes(".//a[text()='View Details']"))
        {
            viewdetailsnode.Remove();
        }

        // change remaining link tags to heading tags
        foreach (HtmlNode linknode in contentdiv.SelectNodes("p/a"))
        {
            linknode.Name = "h3";
            linknode.Attributes.RemoveAll();
        }

        // remove all text blocks that are filled with spaces
        foreach (HtmlNode emptynode in contentdiv.SelectNodes("text()"))
        {
            emptynode.Remove();
        }
    
        jobsLiteral.Text = contentdiv.InnerHtml;
    }
}