import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DestinationsComponent } from './pages/destinations/destinations.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { ManualComponent } from './pages/manual/manual.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "destinations", component:DestinationsComponent},
  {path: "groups", component: GroupsComponent},
  {path: "manual", component: ManualComponent},
  {path: "profile", component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
