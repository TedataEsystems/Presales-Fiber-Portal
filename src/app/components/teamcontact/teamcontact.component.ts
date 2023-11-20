import { Component, Input, NgModule, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Title } from '@angular/platform-browser';

import { FormControl, Validators } from '@angular/forms';
import { contactTeam } from 'src/app/Models/TeamContact';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { ConfigureService } from 'src/app/shared/services/configure.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamcontactService } from 'src/app/shared/services/teamContact.service';
import { DeleteService } from 'src/app/shared/services/delete.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-teamcontact',
  templateUrl: './teamcontact.component.html',
  styleUrls: ['./teamcontact.component.css'],
})
export class TeamcontactComponent implements OnInit {
  displayedColumns: string[] = ['id', 'mail', 'type', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  contactList?: contactTeam[] = [];
  contactListTab?: contactTeam[] = [];
  teamname = '';
  valdata = '';
  valuid = 0;
  dataSource = new MatTableDataSource<any>();
  delconct: any;
  searchKey: string = '';
  listName: string = '';
  loading: boolean = true;
  selected: boolean = false;
  isDisabled = true;
  value = true;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  param1 = '';
  settingtype = '';
  @ViewChild(FormGroupDirective) formGroupDirective?: FormGroupDirective;

  constructor(
    private titleService: Title,
    private contactser: TeamcontactService,
    private notser: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DeleteService,
    private loader:LoadingService,
    private Config: ConfigureService
  ) {
    // Create 100 users
    var teamval = this.Config.UserTeam();
    // if(teamval?.toLocaleLowerCase() !="admin_all")
    //  {
    //   this.notser.warning("not permitted")
    //   this.router.navigate(['/'] );
    //  }
    this.titleService.setTitle('Team Contact');

    this.route.queryParams.subscribe((params: any) => {
      this.param1 = params['team'];
      this.teamname = params['name'];
      if (this.param1 != undefined) {
        this.settingtype = this.param1;
        this.getRequestdata(this.param1);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort as MatSort;
    this.dataSource.paginator = this.paginator as MatPaginator;
  }
  simflag = true;
  ngOnInit() {
    // this.getRequestdata("");
    this.loader.busy();
    var teamval = localStorage.getItem('teamName');

    if (teamval?.toLocaleLowerCase() == 'esp') {
      this.simflag = false;
    } else {
      this.simflag = true;
    }
    // if(this.simflag){
    //   this.notser.warning("not permission");
    //  this.router.navigate(['/'] );

    // }
  }
  getRequestdata(attr: any) {
    this.contactser.contactattr(Number(attr)).subscribe(
      (res) => {
        this.loader.idle();

        if (res.status == true) {
          this.loading = false;

          this.contactList = res.result?.data;
          this.apply('');
        } else this.notser.warning(res.error);
      },
      (err) => {
        if (err.status == 401) this.router.navigate(['/loginuser']);
        else this.notser.warning('! Fail');
      }
    );
  }
  onSearchClear() {
    this.searchKey = '';
    //this.applyFilter();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // applyFilter(){
  //   this.dataSource.filter=this.searchKey.trim().toLowerCase();

  // }
  apply(filterValue: string) {
    this.selected = true;
    this.listName = filterValue;
    this.contactListTab = [];
    this.contactListTab = this.contactList;

    this.setReactValue(Number(0), '', 'to');

    this.dataSource = new MatTableDataSource<any>(this.contactListTab);

    this.dataSource.paginator = this.paginator as MatPaginator;
  }
  applyFilter(filterValue: Event) {
    this.dataSource.filter = (<HTMLInputElement>filterValue.target).value
      .trim()
      .toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onEdit(r: any) {
    this.valdata = r.mail;
    this.valuid = r.id;
    if (r.type != null) this.setReactValue(Number(r.id), r.mail.trim(), r.type);
    else this.setReactValue(Number(r.id), r.mail.trim(), 'to');
  }

  form: FormGroup = new FormGroup({
    id: new FormControl(0),
    mail: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
    ]),
    type: new FormControl('to'),
  }); //18
  isDisable = false;
  onSubmit() {
    //
    this.loader.busy();
    if (this.form.invalid || this.form.value.value == ' ') {
      //   this.setReactValue(Number(0),"",'to');
      return;
    }
    var listval: contactTeam = new contactTeam();
    listval.mail = this.form.value.mail;
    listval.teamId = Number(this.param1);
    listval.type = this.form.value.type;
    if (
      this.form.value.id == 0 ||
      this.form.value.id == null ||
      this.form.value.id == undefined
    ) {
      var pickData = this.contactListTab?.find(
        (x) => x.mail == this.form.value.mail.trim()
      );
      if (pickData) {
        this.setReactValue(Number(0), '', 'to');
        this.isDisable = false;

        this.notser.warning('mail already exist');
        return;
      }
      this.contactser.addcontact(listval).subscribe(
        (res) => {
          this.isDisable = false;

          if (res.status == true) {
            this.loader.idle();
            var pick: contactTeam = new contactTeam();
            pick.teamId = res.data?.teamId;
            pick.id = res.data?.id;
            pick.mail = res.data?.mail;
            pick.type = res.data?.type;
            this.contactListTab?.push(pick);
            this.dataSource = new MatTableDataSource<any>(this.contactListTab);

            this.dataSource.paginator = this.paginator as MatPaginator;
            this.notser.success('Successfully Added');
            this.formGroupDirective?.resetForm();
            this.form.controls.id.setValue(0)
            this.form.controls.type.setValue('to')

            // this.form.markAsPristine();
            // this.form.markAsUntouched();
          } else {
            this.notser.warning('Not Added!');
          }
        },
        (err) => {
          this.isDisable = false;
          if (err.status == 401) this.router.navigate(['/loginuser']);
          else this.notser.warning('! Fail');
        }
      );
    } else {
      var pickData = this.contactListTab?.find(
        (x) => x.mail == this.form.value.mail.trim()
      );
      if (pickData && pickData.id != this.form.value.id) {
        this.isDisable = false;
        this.setReactValue(Number(0), '', 'to');
        this.notser.warning('value already exist');
        return;
      }
      listval.id = Number(this.form.value.id);
      this.contactser.editcontact(listval).subscribe(
        (res) => {
          this.isDisable = false;
          this.loader.idle();
          if (res.status == true) {
            this.contactListTab?.forEach((x) => {
              if (x.id == res.data?.id) {
                x.mail = res.data?.mail;
                x.type = res.data?.type;
              }
            });
            this.dataSource = new MatTableDataSource<any>(this.contactListTab);

            this.dataSource.paginator = this.paginator as MatPaginator;
            this.formGroupDirective?.resetForm();
            this.form.controls.id.setValue(0)
            this.form.controls.type.setValue('to')

            this.notser.success('Successfully Updated');
          } else {
            this.notser.warning('Not saved!');
          }
        },
        (err) => {
          this.isDisable = false;
          if (err.status == 401) this.router.navigate(['/loginuser']);
          else this.notser.warning('! Fail');
        }
      );
    }

    this.isDisabled = true;
  }
  setReactValue(id: number, val: any, num: any) {
    this.form.patchValue({
      id: id,
      mail: val,
      type: num,
    });
  }
  onDelete($key: any) {
    this.dialogService
      .openConfirmDialog()
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.contactser.delcontact($key).subscribe((res) => {
            this.notser.success('Deleted successfully!');
            this.getRequestdata(this.param1);
          });
        }
      });
  }

  onChecknameIsalreadysign(){
    this.form.controls.mail.setValue(this.form.value.mail.trim())

    if (this.form.valid) {
      var pickData = this.contactListTab?.find(
        (x) => x.mail == this.form.value.mail.trim()
      );
      var type = this.contactListTab?.find(
        (x) =>
          x.type == this.form.value.type.trim() && x.id == this.form.value.id
      );

      //add
      if (
        this.form.value.id == 0 ||
        this.form.value.id == null ||
        this.form.value.id == undefined
      ) {
        debugger
        if (pickData) {
          // if (type) {
            // this.notser.warning("mail already exist");
            this.value = false;
            this.isDisabled = true;
          // } else {
          //   this.value = false;
          //   this.isDisabled = false;
          // }
        } else {
          this.value = true;
          this.isDisabled = false;
        }
      }
      else{

        debugger;
        //edit
        if (pickData) {
          if (type) {
            // this.notser.warning("mail already exist");
            this.value = true;
            this.isDisabled = true;
          } else {
            this.value = true;
            // this.isDisabled = false;
            this.isDisabled = false;
          }
        }
        else{
          this.value = true;

          this.isDisabled = false;
        }




      }
    } else {
      this.value = true;
      this.isDisabled = true;
    }
  }
}
