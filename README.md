# Wealth Economy

An experimental resource management system that aims to provide a more sustainable and productive economic model

---

#### Setup

To build and run the project:
* Clone or download the project
* Open it with Visual Studio
* Build the solution
* Optional: Update the files under "ngClient\app\configs" and "WebApi\Configs" folders with your own settings
* Run "ngClient" and "WebApi" projects
* Navigate to [http://localhost:15002/](http://localhost:15002/) with your browser

To be able run Entity Framework related T4 files (.tt files that include "EF6.Utility.ttinclude" file):
* After restoring nuget packages, find and copy "EntityFramework.dll" and "EntityFramework.SqlServer.dll" files under "[Solution Folder]\packages" folder
* Go to "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE" folder
* Optional: Take a backup of the existing files
* Paste these two files to this folder

To be able display "Jasmine" tests under "WebApi.Tests\ng-test" folder in "Test Explorer" window, install the following extension:
* Chutzpah Test Adapter for the Test Explorer

---

#### [Release Notes](/SolutionItems/Documents/Release Notes.md)
