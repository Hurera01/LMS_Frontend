import { Component, inject } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgFor } from '@angular/common';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { FormsModule, NgModel } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';


interface ItemData {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-users',
  imports: [NzTableModule, NgFor,NzButtonModule, NzPaginationComponent, FormsModule, NzModalModule,NzFormModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  listOfData: ItemData[] = [];
  pageIndex: number = 1; 
  pageSize: number = 5;
  total: number = 0; 
  selectedUser: ItemData = { userId: 0, email: '', firstName: '', lastName: '' };
  isEditModalVisible = false;

  private userService = inject(UserService);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.listOfData = data.users;  
      this.total = data.totalCount; 
      console.log(this.listOfData, this.total)
    });
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.fetchUsers(); 
  }

  onEditUser(user: ItemData): void {
    this.selectedUser = { ...user }; // Store user in selectedUser
    this.isEditModalVisible = true; // Show modal
  }

  onDeleteUser(user: ItemData): void {
    if (confirm(`Are you sure you want to delete ${user.firstName}?`)) {
      this.userService.deleteUser(user.userId).subscribe(() => {
        this.listOfData = this.listOfData.filter(u => u.userId !== user.userId);
      });
    }
  }

  updateUser(): void {
    console.log('Updated user:', this.selectedUser);
    this.isEditModalVisible = false;
  }


  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
