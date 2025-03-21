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
import { DoctorsFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { DoctorsDeleteComponent } from './dialogs/delete/delete.component';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { DoctorService } from './doctors.service';
import { Doctors} from './doctors.model';
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
    selector: 'app-all-doctors',
    templateUrl: './all-doctors.component.html',
    styleUrls: ['./all-doctors.component.scss'],
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
export class AllDoctersComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id', label: 'ID', type: 'text', visible: false },
    { def: 'first_name', label: 'First Name', type: 'text', visible: true },
    { def: 'last_name', label: 'Last Name', type: 'text', visible: true },
    { def: 'department', label: 'Department', type: 'text', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'gender', label: 'Gender', type: 'text', visible: true },
    { def: 'phone', label: 'Phone', type: 'phone', visible: true },
    { def: 'address', label: 'Address', type: 'address', visible: true },
    { def: 'dob', label: 'Date of Birth', type: 'date', visible: true },
    { def: 'biography', label: 'Biography', type: 'text', visible: false },
    { def: 'image', label: 'Image', type: 'image', visible: false },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];
  

  dataSource = new MatTableDataSource<Doctors>([]);
  selection = new SelectionModel<Doctors>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    {
      title: 'All Doctors',
      items: ['Doctors'],
      active: 'All Doctors',
    },
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public DoctorService: DoctorService,
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
  //   this.DoctorService.getAlDoctors().subscribe({
  //     next: (data) => {
  //       this.dataSource.data = data;
  //       this.isLoading = false;
  //       this.refreshTable();
  //       this.dataSource.filterPredicate = (data: Doctors, filter: string) =>
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
    this.DoctorService.getAlDoctors().subscribe({
      next: (response) => {
        // Access the doctors array inside the response object
        this.dataSource.data = response.doctors; 
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: Doctors, filter: string) =>
          Object.values(data).some((value) =>
            value.toString().toLowerCase().includes(filter)
          );
        console.log('data', this.dataSource.data);
        console.log('dataaaa', response);
      },
      error: (err) => console.error(err),
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

  editCall(row: Doctors) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: Doctors) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DoctorsFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { Doctors: data, action },
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

  private updateRecord(updatedRecord: Doctors) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: Doctors) {
    const dialogRef = this.dialog.open(DoctorsDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.id !== row.id
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-danger',
          'Delete Record Successfully...!!!',
          'bottom',
          'center'
        );
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
    // const exportData = this.dataSource.filteredData.map((x) => ({
    //   Name: x.name,
    //   Email: x.email,
    //   Gender: x.gender,
    //   Mobile: x.mobile,
    //   Department: x.department,
    //   Degree: x.degree,
    //   Address: x.address,
    //   'Hire Date': formatDate(new Date(x.hire_date), 'yyyy-MM-dd', 'en') || '',
    //   Salary: x.salary,
    //   Specialization: x.subject_specialization,
    //   'Experience (Years)': x.experience_years,
    //   Status: x.status,
    //   Birthdate: formatDate(new Date(x.birthdate), 'yyyy-MM-dd', 'en') || '',
    //   Bio: x.bio,
    // }));

    // TableExportUtil.exportToExcel(exportData, 'staff_export');
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
    this.dataSource.data = this.dataSource.data.filter(
      (item) => !this.selection.selected.includes(item)
    );
    this.selection.clear();
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} Record(s) Deleted Successfully...!!!`,
      'bottom',
      'center'
    );
  }
  onContextMenu(event: MouseEvent, item: Doctors) {
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
