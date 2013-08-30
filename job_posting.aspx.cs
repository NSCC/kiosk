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
				string url = "http://www.nscc.ca/services/graduate_employment_services/grad_employ_full.asp";

        // now go to listing of jobs page
        HttpWebRequest jobRequest = (HttpWebRequest)WebRequest.Create(url);
        jobRequest.Method = "GET";

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
