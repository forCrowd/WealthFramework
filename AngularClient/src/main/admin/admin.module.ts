import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { MomentModule } from "angular2-moment";

// Components
import { AdminOverviewComponent } from "./admin-overview.component";
import { ResourcePoolsComponent } from "./resource-pools.component";

// Services
import { AdminGuard } from "./admin-guard.service";
import { AdminService } from "./admin.service";

// Routes
const adminRoutes: Routes = [
    { path: "app/admin", component: AdminOverviewComponent, canActivate: [AdminGuard], data: { title: "Admin Overview" } },
    { path: "app/admin/resource-pools", component: ResourcePoolsComponent, canActivate: [AdminGuard], data: { title: "Resource pools" } },
];

@NgModule({
    declarations: [
        AdminOverviewComponent,
        ResourcePoolsComponent
    ],
    exports: [
        RouterModule
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(adminRoutes),
        MomentModule
    ],
    providers: [
        AdminGuard,
        AdminService
    ]
})
export class AdminModule { }
