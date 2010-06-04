<%@ Page Language="C#" AutoEventWireup="true" CodeFile="job_posting.aspx.cs" Inherits="job_posting" EnableViewState="False" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style type="text/css">
        body { font-family: Arial, Verdana, Sans-Serif; font-size: 2em; }
        h2,h3 {margin:0;}
        h2 {font-size: 2em;}
        h3 {font-size: 1.5em;}
        .note {color: #FFFFFF; background-color: #000099; padding: 5px; font-size: 1.5em;}
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <p class="note">To view complete details of these positions, go to 
            http://www.nscc.ca/Services/Graduate_Employment_Services</p>
        <asp:Literal ID="jobsLiteral" runat="server"></asp:Literal>
    </div>
    </form>
</body>
</html>
