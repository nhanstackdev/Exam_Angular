import { CalendarModule } from 'primeng/calendar';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StickyDirective } from './sticky.directive';
import { AppRoutingModule } from './app-routing.module';
import { TestComponent } from './pages/test/test.component';
import { HomeComponent } from './pages/home/home.component';
import { StickyColsDirective } from './directives/sticky-cols.directive';

@NgModule({
  declarations: [
    AppComponent,
    StickyDirective,
    TestComponent,
    HomeComponent,
    StickyColsDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CalendarModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
