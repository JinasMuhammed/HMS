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
import { AdmissionInquiryDeleteComponent } from './dialogs/delete/delete.component';
import { AdmissionInquirysFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { AdmissionInquiry } from './admission-inquiry.model';
import { AdmissionInquiryService } from './admission-inquiry.service';

@Component({
    selector: 'app-admission-inquiry',
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
    ],
    templateUrl: './admission-inquiry.component.html',
    styleUrl: './admission-inquiry.component.scss'
})
export class AdmissionInquiryComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'inquiryId', label: 'Inquiry ID', type: 'number', visible: false },
    { def: 'studentName', label: 'Student Name', type: 'text', visible: true },
    {
      def: 'guardianName',
      label: 'Guardian Name',
      type: 'text',
      visible: true,
    },
    {
      def: 'contactNumber',
      label: 'Contact Number',
      type: 'phone',
      visible: true,
    },
    {
      def: 'emailAddress',
      label: 'Email Address',
      type: 'email',
      visible: true,
    },
    {
      def: 'dateOfInquiry',
      label: 'Date of Inquiry',
      type: 'date',
      visible: true,
    },
    {
      def: 'programOfInterest',
      label: 'Program of Interest',
      type: 'text',
      visible: false,
    },
    {
      def: 'preferredStartDate',
      label: 'Preferred Start Date',
      type: 'date',
      visible: false,
    },
    {
      def: 'inquirySource',
      label: 'Inquiry Source',
      type: 'text',
      visible: true,
    },
    { def: 'status', label: 'Status', type: 'text', visible: true },
    { def: 'notes', label: 'Notes', type: 'text', visible: false },
    {
      def: 'followUpDate',
      label: 'Follow Up Date',
      type: 'date',
      visible: true,
    },
    { def: 'assignedTo', label: 'Assigned To', type: 'text', visible: true },
    {
      def: 'campusLocation',
      label: 'Campus Location',
      type: 'text',
      visible: true,
    },
    {
      def: 'previousEducation',
      label: 'Previous Education',
      type: 'text',
      visible: true,
    },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<AdmissionInquiry>([]);
  selection = new SelectionModel<AdmissionInquiry>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    {
      title: 'Admission Inquiry',
      items: ['Frount'],
      active: 'Admission Inquiry',
    },
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public admissionInquiryService: AdmissionInquiryService,
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
    this.admissionInquiryService.getAdmissionInquiries().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (
          data: AdmissionInquiry,
          filter: string
        ) =>
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

  editCall(row: AdmissionInquiry) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: AdmissionInquiry) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AdmissionInquirysFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { admissionInquiry: data, action },
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

  private updateRecord(updatedRecord: AdmissionInquiry) {
    const index = this.dataSource.data.findIndex(
      (record) => record.inquiryId === updatedRecord.inquiryId
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: AdmissionInquiry) {
    const dialogRef = this.dialog.open(AdmissionInquiryDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.inquiryId !== row.inquiryId
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
    const exportData = this.dataSource.filteredData.map((x) => ({
      'Inquiry ID': x.inquiryId,
      'Student Name': x.studentName,
      'Guardian Name': x.guardianName,
      'Contact Number': x.contactNumber,
      'Email Address': x.emailAddress,
      'Date of Inquiry': x.dateOfInquiry,
      'Program of Interest': x.programOfInterest,
      'Preferred Start Date': x.preferredStartDate,
      'Inquiry Source': x.inquirySource,
      Status: x.status,
      Notes: x.notes,
      'Follow Up Date': x.followUpDate,
      'Assigned To': x.assignedTo,
      'Campus Location': x.campusLocation,
      'Previous Education': x.previousEducation,
    }));

    TableExportUtil.exportToExcel(exportData, 'admissionInquiry_export');
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
  onContextMenu(event: MouseEvent, item: AdmissionInquiry) {
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
