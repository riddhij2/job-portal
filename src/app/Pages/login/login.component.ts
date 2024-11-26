import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, Inject, NgModule, PLATFORM_ID, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from '../../models/Login/login';
import { AuthenticationService } from '../../Services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginPage = false;
  username: string = '';
  password: string = '';
  isContentLoaded = false;
  loginInfo = new Login;
  isAuthenticated = false;
  onSubmit() {
    if (this.username === 'Test@123' && this.password === '123456') {
      this.isAuthenticated = true;
      sessionStorage.setItem('isAuthenticated', 'true');
      this.router.navigate(['/admin']);
    } else {
      console.log('Invalid login');
    }
  }
  
  constructor(private renderer: Renderer2, private route: ActivatedRoute, private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoginPage = this.route.snapshot.routeConfig?.path === 'login';
      if (this.isLoginPage) {
        this.loadExternalResources();
        setTimeout(() => {
          this.isContentLoaded = true;
        }, 500);
      }
    }
  }

  loadExternalResources() {
    // Add CSS files
    this.addStylesheet('assets/css/bootstrap.css');
    this.addStylesheet('assets/css/core.css');
    this.addStylesheet('assets/css/font-icons.css');
    this.addStylesheet('/assets/css/form.css');

    // Add JS files
    this.addScript('assets/js/plugin.min.js');
    this.addScript('assets/js/plugin-join-able.js');
    this.addScript('assets/js/re-sizeable.js');
    this.addScript('assets/js/sidebar-api.js');
    this.addScript('assets/js/custom.js');
  }

  // Function to add stylesheet dynamically
  addStylesheet(href: string) {
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(link, 'href', href);
    this.renderer.appendChild(document.head, link);
  }

  // Function to add script dynamically
  addScript(src: string) {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'src', src);
    this.renderer.appendChild(document.head, script);
  }
}
