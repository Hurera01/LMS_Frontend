import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { LayoutComponent } from './features/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './features/register/register.component';
import { UsersComponent } from './features/users/users.component';
import { BooksComponent } from './features/books/books.component';
import { LibraryComponent } from './features/library/library.component';
import { StudentComponent } from './features/student/student.component';
import { MyBooksComponent } from './features/my-books/my-books.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {
        path: '',
        component:LayoutComponent,
        children:[
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [authGuard],
                children: [
                    {path:'users', component: UsersComponent},
                    {path:'books', component: BooksComponent},
                    {
                        path: 'student',
                        component: StudentComponent,
                        children:[
                            {path:'library', component:LibraryComponent},
                            {path:'my-books', component:MyBooksComponent},
                            {path:'', redirectTo:'library', pathMatch:'full'}
                        ]
                    },
                    { path: '', redirectTo: 'users', pathMatch: 'full' } 
                ] 
            },
            // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ]
    },
           
];
    