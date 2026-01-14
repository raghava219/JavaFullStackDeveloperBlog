# Java Full Stack Developer Blog

## Following are reference links:

https://supabase.com/docs/guides/getting-started/tutorials/with-angular?queryGroups=database-method&database-method=sql

https://www.youtube.com/watch?v=v6Is9dqwbk4

## Following is the Functional requiremnet of blog:

1. There are three type of users - Client, Editors and Admin
2. Clients are just consumers of this blog.
3. Editors will be provided login credentials by the Admin.
4. Editors login with those credentials and enter new article for blog.
5. Admin should be having the list view of the articles, so that he can perorm all CRUD operation.
6. QA Server Building configuration :
   ng build --configuration=qa
   ng serve --configuration=qa
7. PROD Server Building configuration :
   ng build --configuration=prod
   ng serve --configuration=prod

## ToDo List:

1. Feature: Slides Creation.
   Activity:

   1. Provision of Tag tab for the users.
   2. Improve the visibility of tiles like slides when the users clicks on specific tag.
      Start Date: 29-12-2025
      End Date: 31-12-2025

2. Feture: Good to Have
   Activity:
   1. Add a button to roll back to previous category in article.component.html.
3. Deploying the application to GCP, following is the reference link:
   https://www.youtube.com/watch?v=O-rnuP3h4u8
4. When the user clicks on edit list in list, he should be above to edit the contents.
