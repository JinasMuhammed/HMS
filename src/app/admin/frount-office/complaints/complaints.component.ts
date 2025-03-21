import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass, DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { rowsAnimation, TableExportUtil } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Subject } from 'rxjs';
import { Complaints } from '../complaints/complaints.model';
import { ComplaintsService } from '../complaints/complaints.service';
import { ComplaintsDeleteComponent } from './dialogs/delete/delete.component';
import { ComplaintsFormComponent } from './dialogs/form-dialog/form-dialog.component';

@Component({
    selector: 'app-complaints',
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
    ],
    templateUrl: './complaints.component.html',
    styleUrl: './complaints.component.scss'
})
export class ComplaintsComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'complaintId', label: 'Com. ID', type: 'text', visible: true },
    {
      def: 'complainantName',
      label: 'Complainant Name',
      type: 'text',
      visible: true,
    },
    {
      def: 'complainantType',
      label: 'Complainant Type',
      type: 'text',
      visible: true,
    },
    {
      def: 'complaintDate',
      label: 'Complaint Date',
      type: 'date',
      visible: true,
    },
    {
      def: 'complaintTime',
      label: 'Complaint Time',
      type: 'time',
      visible: true,
    },

    { def: 'studentName', label: 'Student Name', type: 'text', visible: false },
    {
      def: 'complaintDescription',
      label: 'Complaint Description',
      type: 'text',
      visible: true,
    },
    { def: 'status', label: 'Status', type: 'text', visible: true },
    { def: 'department', label: 'Department', type: 'text', visible: true },
    { def: 'assignedTo', label: 'Assigned To', type: 'text', visible: true },
    {
      def: 'resolutionDescription',
      label: 'Resolution Description',
      type: 'text',
      visible: false,
    },
    {
      def: 'resolutionDate',
      label: 'Resolution Date',
      type: 'date',
      visible: true,
    },
    {
      def: 'priorityLevel',
      label: 'Priority Level',
      type: 'text',
      visible: true,
    },
    { def: 'feedback', label: 'Feedback', type: 'text', visible: false },
    { def: 'createdAt', label: 'Created At', type: 'datetime', visible: false },
    { def: 'updatedAt', label: 'Updated At', type: 'datetime', visible: false },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Complaints>([]);
  selection = new SelectionModel<Complaints>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    {
      title: 'Complaints',
      items: ['Frount'],
      active: 'Complaints',
    },
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public complaintsService: ComplaintsService,
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

  loadData() {
    this.complaintsService.getComplaints().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: Complaints, filter: string) =>
          Object.values(data).some((value) =>
            value.toString().toLowerCase().includes(filter)
          );
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

  editCall(row: Complaints) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: Complaints) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ComplaintsFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { complaints: data, action },
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

  private updateRecord(updatedRecord: Complaints) {
    const index = this.dataSource.data.findIndex(
      (record) => record.complaintId === updatedRecord.complaintId
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: Complaints) {
    const dialogRef = this.dialog.open(ComplaintsDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.complaintId !== row.complaintId
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
    const exportData = this.dataSource.filteredData.map((complaint) => ({
      'Complaint ID': complaint.complaintId,
      'Complaint Date': complaint.complaintDate
        ? formatDate(complaint.complaintDate, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Complaint Time': complaint.complaintTime || 'N/A',
      'Complainant Name': complaint.complainantName,
      'Complainant Type': complaint.complainantType,
      'Student Name': complaint.studentName || 'N/A',
      'Complaint Description': complaint.complaintDescription,
      Department: complaint.department,
      Status: complaint.status,
      'Assigned To': complaint.assignedTo,
      'Resolution Description': complaint.resolutionDescription || 'N/A',
      'Resolution Date': complaint.resolutionDate
        ? formatDate(complaint.resolutionDate, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Priority Level': complaint.priorityLevel,
      Feedback: complaint.feedback || 'N/A',
      'Created At': complaint.createdAt
        ? formatDate(complaint.createdAt, 'yyyy-MM-dd HH:mm:ss', 'en')
        : 'N/A',
      'Updated At': complaint.updatedAt
        ? formatDate(complaint.updatedAt, 'yyyy-MM-dd HH:mm:ss', 'en')
        : 'N/A',
    }));

    TableExportUtil.exportToExcel(exportData, 'complaints_export');
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
  onContextMenu(event: MouseEvent, item: Complaints) {
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
