# Wealth Economy

An experimental resource management system that aims to provide a more sustainable and productive economic model

---

#### Setup

To build and run the project:
* Clone or download the project
* Open it with Visual Studio
* Build the solution
* Optional: Update the files under Web\Configs folder with your own settings
* Run "Web" project under "1. Presentation Layer"
* Navigate to [http://localhost:15001/](http://localhost:15001/) with your browser

To be able run Entity Framework related T4 files (.tt files that include "EF6.Utility.ttinclude" file):
* Go to "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE" folder
* Take a copy of "EntityFramework.dll" and "EntityFramework.SqlServer.dll" files
* Find and copy these two files from "packages" folder under the solution (after restoring nuget packages)
* Paste them to the first folder mentioned

To be able display "Jasmine" tests under "Web.Tests\ng-test" folder in "Test Explorer" window, install the following extension:
* Chutzpah Test Adapter for the Test Explorer

---

#### [Release Notes](/SolutionItems/Notes/Release Notes.md)
