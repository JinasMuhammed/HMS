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
import { VisitorsDeleteComponent } from './dialogs/delete/delete.component';
import { VisitorsFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { Visitors } from './visitors.model';
import { VisitorsService } from './visitors.service';

@Component({
    selector: 'app-visitors',
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
    templateUrl: './visitors.component.html',
    styleUrl: './visitors.component.scss'
})
export class VisitorsComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'visitorId', label: 'Visitor ID', type: 'text', visible: false },
    { def: 'visitorName', label: 'Visitor Name', type: 'text', visible: true },
    { def: 'visitDate', label: 'Visit Date', type: 'date', visible: true },
    { def: 'visitTime', label: 'Visit Time', type: 'time', visible: true },
    {
      def: 'purposeOfVisit',
      label: 'Purpose of Visit',
      type: 'text',
      visible: true,
    },
    {
      def: 'contactNumber',
      label: 'Contact Number',
      type: 'phone',
      visible: true,
    },
    { def: 'visitorType', label: 'Visitor Type', type: 'text', visible: true },
    {
      def: 'departmentPersonVisited',
      label: 'Department/Person Visited',
      type: 'text',
      visible: true,
    },
    {
      def: 'checkOutTime',
      label: 'Check-Out Time',
      type: 'time',
      visible: false,
    },
    {
      def: 'idProofType',
      label: 'ID Proof Type',
      type: 'text',
      visible: false,
    },
    {
      def: 'idProofNumber',
      label: 'ID Proof Number',
      type: 'text',
      visible: false,
    },
    { def: 'notes', label: 'Notes', type: 'text', visible: false },
    { def: 'createdAt', label: 'Created At', type: 'datetime', visible: false },
    { def: 'updatedAt', label: 'Updated At', type: 'datetime', visible: false },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Visitors>([]);
  selection = new SelectionModel<Visitors>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    {
      title: 'Visitor Book',
      items: ['Frount'],
      active: 'Visitor Book',
    },
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public visitorsService: VisitorsService,
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
    this.visitorsService.getVisitors().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: Visitors, filter: string) =>
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

  editCall(row: Visitors) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: Visitors) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(VisitorsFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { visitors: data, action },
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

  private updateRecord(updatedRecord: Visitors) {
    const index = this.dataSource.data.findIndex(
      (record) => record.visitorId === updatedRecord.visitorId
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: Visitors) {
    const dialogRef = this.dialog.open(VisitorsDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.visitorId !== row.visitorId
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
    const exportData = this.dataSource.filteredData.map((visitor) => ({
      'Visitor ID': visitor.visitorId,
      'Visitor Name': visitor.visitorName,
      'Visit Date': visitor.visitDate
        ? formatDate(visitor.visitDate, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Visit Time': visitor.visitTime || 'N/A',
      'Purpose of Visit': visitor.purposeOfVisit,
      'Contact Number': visitor.contactNumber,
      'Visitor Type': visitor.visitorType,
      'Student Name': visitor.visitorsName || 'N/A',
      'Department/Person Visited': visitor.departmentPersonVisited,
      'Check-Out Time': visitor.checkOutTime || 'N/A',
      'ID Proof Type': visitor.idProofType,
      'ID Proof Number': visitor.idProofNumber,
      Notes: visitor.notes || 'N/A',
      'Created At': visitor.createdAt
        ? formatDate(visitor.createdAt, 'yyyy-MM-dd HH:mm:ss', 'en')
        : 'N/A',
      'Updated At': visitor.updatedAt
        ? formatDate(visitor.updatedAt, 'yyyy-MM-dd HH:mm:ss', 'en')
        : 'N/A',
    }));

    TableExportUtil.exportToExcel(exportData, 'visitors_export');
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
  onContextMenu(event: MouseEvent, item: Visitors) {
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
