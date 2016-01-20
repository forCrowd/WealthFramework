# Wealth Economy

An experimental resource management system that aims to provide a more sustainable and productive economic model

---

#### Setup

To build and run the project:
* Clone or download the project
* Open it with Visual Studio
* Visual Studio will restore node & bower packages
* Build the solution and restore nuget packages
* Optional: Update the files under "WebApi\Configs" and "ngClient\app\settings" folders with your own settings
* Run "WebApi" and "ngClient" projects
* Navigate to [http://localhost:15002/](http://localhost:15002/) with your browser

To be able run Entity Framework related T4 files (.tt files that include "EF6.Utility.ttinclude" file):
* After restoring nuget packages, find and copy "EntityFramework.dll" and "EntityFramework.SqlServer.dll" files under "[Solution Folder]\packages" folder
* Go to "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE" folder
* Optional: Take a backup of the existing files
* Paste these two files to this folder

To be able display "Jasmine" tests under "WebApi.Tests\ng-test" folder in "Test Explorer" window, install the following extension:
* [Chutzpah Test Adapter for the Test Explorer](https://visualstudiogallery.msdn.microsoft.com/f8741f04-bae4-4900-81c7-7c9bfb9ed1fe)

---

#### [Release Notes](/SolutionItems/Documents/Release Notes.md)
