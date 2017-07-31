import { Component, OnInit } from "@angular/core";

import { AdminService } from "./admin.service";
import { User } from "../app-entity-manager/entities/user";

@Component({
    selector: "admin-overview",
    templateUrl: "admin-overview.component.html"
})
export class AdminOverviewComponent implements OnInit {

    resourcePoolCount: number = 0;
    userCount: number = 0;

    get currentUser(): User {
        return this.adminService.currentUser;
    }

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {

        this.adminService.getResourcePoolSet(true).subscribe((response) => {
            this.resourcePoolCount = response.count;
        });

        this.adminService.getUserCount().subscribe((count) => {
            this.userCount = count;
        });
    }
}
