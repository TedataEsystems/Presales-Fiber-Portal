import { Component, OnInit,Inject } from '@angular/core';
import { from } from 'rxjs';
import{LoginserService}from'src/app/shared/services/loginser.service';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ConfigureService } from 'src/app/shared/services/configure.service';
import { NotificationService} from 'src/app/shared/services/notification.service';
import {DOCUMENT} from '@angular/common';
import { Login } from 'src/app/Models/Logincls';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  warning=false;
  form: FormGroup=new FormGroup({
    username: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required)

  });
  currentLang : string;
  public loginInvalid: boolean=false;
  private formSubmitAttempt: boolean=false;
  private returnUrl: string='';
  loginmodel:Login ={
    userName:"",
    password:""
  }
  constructor(private serlogin:LoginserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notser:NotificationService,
    private titleService: Title,
    private config:ConfigureService,

    @Inject(DOCUMENT) private document: Document
    )
    {
      this.config.Logout();
      this.titleService.setTitle("Presales Fiber Portal | Login");
      this.currentLang = localStorage.getItem("currentLang") as string || 'en';
      //this.translate.use(this.currentLang);


    }

  ngOnInit(): void {


  }

  onSubmit() {
      if (this.form.invalid) {
          return;
      }

      this.loginmodel.userName = this.form.value.username.trim();
      this.loginmodel.password = this.form.value.password;
      this.serlogin.getLogin(this.loginmodel).subscribe(res=>{

    if(res.status==true){
      localStorage.setItem("tokNum", res.token);
    localStorage.setItem("usernam", res.userData.userName);
    localStorage.setItem("teamName", res.userData.userGroup);
    var team=  this.config.UserTeam();

window.location.href="/"


  //  this.router.navigate(['/'], { relativeTo: this.route });
    }
    else{
      // this.notser.Warning("Invalid username or password!") ;
      this.warning=true;

    }

    // Retrieve
      },err=>{
      // this.notser.Warning("Invalid username or password!") ;
      this.warning=true;
      });


  }












}
