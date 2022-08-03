Test Tool WebApp
=====================================

Test Tool WebApp consits of two parts:

-  Client - static webpage which serves test boards managing GUI
-  Service - manages all test boards connections, acts as server for webpage.

Client part is written using ReactJS. Webpage consists of three pages:

-  Login - used for login
-  Options - used to set various parameters (Product code, hardware, firmware, configuration files) for test boards before testing
-  Dashboard - live represantation of test boards status.

Service part of webapp has three main parts:

-  Network Scanner - periodicaly scans local network for connected test boards
-  Test Board Handler - handles test board action requests, status.
-  Server - serves endpoints and websocket for browser.