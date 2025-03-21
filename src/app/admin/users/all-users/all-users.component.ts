import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { UsersFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { UsersDeleteComponent } from './dialogs/delete/delete.component';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { UsersService } from './users.service';
import { Users} from './users.model';
import { rowsAnimation, TableExportUtil } from '@shared';
import { formatDate, DatePipe, CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Direction } from '@angular/cdk/bidi';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-all-users',
    templateUrl: './all-users.component.html',
    styleUrls: ['./all-users.component.scss'],
    animations: [rowsAnimation],
    imports: [
        BreadcrumbComponent,
        FeatherIconsComponent,
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatOptionModule,
        MatCheckboxModule,
        MatTableModule,
        MatSortModule,
        NgClass,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatPaginatorModule,
        DatePipe,
    ]
})
export class AllUsersComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id', label: 'ID', type: 'text', visible: false },
    { def: 'username', label: 'Username', type: 'text', visible: true },
    { def: 'firstName', label: 'First Name', type: 'text', visible: true },
    { def: 'lastName', label: 'Last Name', type: 'text', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'role', label: 'Role', type: 'text', visible: true },
    { def: 'email_status', label: 'Email Status', type: 'text', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];
  

  dataSource = new MatTableDataSource<Users>([]);
  selection = new SelectionModel<Users>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    {
      title: 'All Users',
      items: ['Users'],
      active: 'All Users',
    },
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public UsersService: UsersService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  // loadData() {
  //   this.UsersService.getAlDoctors().subscribe({
  //     next: (data) => {
  //       this.dataSource.data = data;
  //       this.isLoading = false;
  //       this.refreshTable();
  //       this.dataSource.filterPredicate = (data: Users, filter: string) =>
  //         Object.values(data).some((value) =>
  //           value.toString().toLowerCase().includes(filter)
  //         );
  //         console.log('data',this.dataSource.data)
  //         console.log('dataaaa',data)
  //     },
  //     error: (err) => console.error(err),
  //   });
  // }
  loadData() {
 this.UsersService.getAllUsers().subscribe({
  next: (response) => {  // Add correct typing for response
    console.log('Users fetched:', response);

    // Assuming `response.users` is an array of user objects
    this.dataSource.data = response.users;  
    this.isLoading = false;
    this.refreshTable();  // Ensure this is a function that refreshes your table

    // Update filter predicate for dynamic search in table
    this.dataSource.filterPredicate = (data: Users, filter: string) => {
      return Object.values(data).some((value) =>
        value.toString().toLowerCase().includes(filter.toLowerCase())
      );
    };

    // Debugging logs (optional)
    console.log('Data in the table source:', this.dataSource.data);
    console.log('Full response:', response);
  },
  error: (err) => {
    console.error('Error fetching users:', err);
    this.isLoading = false;  // Stop loading spinner in case of an error
  },
});

  }
  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addNew() {
    this.openDialog('add');
  }

  editCall(row: Users) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: Users) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(UsersFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { Users: data, action },
      direction: varDirection,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'add') {
          this.dataSource.data = [result, ...this.dataSource.data];
        } else {
          this.updateRecord(result);
        }
        this.refresh();
        this.refreshTable();
        this.showNotification(
          action === 'add' ? 'snackbar-success' : 'black',
          `${action === 'add' ? 'Add' : 'Edit'} Record Successfully...!!!`,
          'bottom',
          'center'
        );
      }
    });
  }

  private updateRecord(updatedRecord: Users) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
    this.refresh()
  }

deleteItem(row: Users) {
  const dialogRef = this.dialog.open(UsersDeleteComponent, {
    data: row,
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      // Call the API to delete the user from the backend
      this.UsersService.deleteUser(row.id).subscribe({
        next: (response) => {
          // Successfully deleted, update the table
          this.dataSource.data = this.dataSource.data.filter(
            (record) => record.id !== row.id
          );
          this.refresh()
          this.refreshTable();

          // Show success notification
          this.showNotification(
            'snackbar-success',
            'Deleted Record Successfully...!!!',
            'bottom',
            'center'
          );
        },
        error: (error) => {
          // Handle error, e.g., show error notification
          this.showNotification(
            'snackbar-danger',
            'Failed to delete record. Please try again later.',
            'bottom',
            'center'
          );
        }
      });
    }
  });
}


  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      Name: x.username,
      Email: x.email,
      Password: x.password,
      Role: x.role,
      FirstName: x.firstName,
      LastName: x.lastName
  
    }));

    TableExportUtil.exportToExcel(exportData, 'Users Data');
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
  
    // Call the delete API for each selected user
    this.selection.selected.forEach((selectedUser) => {
      this.UsersService.deleteUser(selectedUser.id).subscribe({
        next: (response) => {
          console.log(`Deleted user with ID: ${selectedUser.id}`);
        },
        error: (error) => {
          console.error(`Failed to delete user with ID: ${selectedUser.id}`);
          this.showNotification(
            'snackbar-danger',
            `Failed to delete ${selectedUser.username}...!!!`,
            'bottom',
            'center'
          );
        }
      });
    });
  
    // After deletion, update the local data source
    this.dataSource.data = this.dataSource.data.filter(
      (item) => !this.selection.selected.includes(item)
    );
    this.selection.clear();
  
    // Show success notification
    this.showNotification(
      'snackbar-success',
      `${totalSelect} Record(s) Deleted Successfully...!!!`,
      'bottom',
      'center'
    );
  }
  
  onContextMenu(event: MouseEvent, item: Users) {
    event.preventDefault();
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`,
    };
    if (this.contextMenu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
