import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatButtonToggleModule,  MatCardModule, MatChipsModule, MatDialogModule, MatDividerModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatRadioModule, MatSidenavModule,  MatSliderModule } from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSelectModule} from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColorPickerComponent } from './components/color-tool/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/color-tool/color-slider/color-slider.component';
import {ColorToolComponent} from './components/color-tool/color-tool.component';
import { AlertDialogComponent } from './components/dialog/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './components/dialog/confirm-dialog/confirm-dialog.component';
import { CreateDrawingDialogComponent } from './components/dialog/create-drawing-dialog/create-drawing-dialog.component';
import { ExportDrawingDialogComponent } from './components/dialog/export-drawing-dialog/export-drawing-dialog.component';
import { SaveDrawingDialogComponent } from './components/dialog/save-drawing-dialog/save-drawing-dialog.component';
import { DrawMenuComponent } from './components/draw-menu/draw-menu.component';
import { DrawZoneComponent } from './components/draw-zone/draw-zone.component';
import { DrawingComponent } from './components/gallery/drawing/drawing.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { GridComponent } from './components/grid/grid.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { TextureComponent } from './components/texture/texture.component';
import { ColorTAPComponent } from './components/ToolAttributePanels/color-tap/color-tap.component';
import { DrawTAPComponent } from './components/ToolAttributePanels/draw-tap/draw-tap.component';
import { EraseTapComponent } from './components/ToolAttributePanels/erase-tap/erase-tap.component';
import { GridTAPComponent } from './components/ToolAttributePanels/grid-tap/grid-tap.component';
import { LineTAPComponent } from './components/ToolAttributePanels/line-tap/line-tap.component';
import { SelectionTAPComponent } from './components/ToolAttributePanels/selection-tap/selection-tap.component';
import { ShapeTAPComponent } from './components/ToolAttributePanels/shape-tap/shape-tap.component';
import { TextTAPComponent } from './components/ToolAttributePanels/text-tap/text-tap.component';
import { UserGuideDescriptionComponent } from './components/user-guide/user-guide-description/user-guide-description.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { WorkZoneComponent } from './components/work-zone/work-zone.component';

@NgModule({
    declarations: [AppComponent,
        WorkZoneComponent,
        MainMenuComponent,
        GalleryComponent,
        DrawZoneComponent,
        DrawMenuComponent,
        ShapeTAPComponent,
        DrawTAPComponent,
        LineTAPComponent,
        ColorTAPComponent,
        TextTAPComponent,
        UserGuideComponent,
        ColorToolComponent,
        ColorPickerComponent,
        ColorSliderComponent,
        TextureComponent,
        UserGuideDescriptionComponent,
        EraseTapComponent,
        CreateDrawingDialogComponent,
        SaveDrawingDialogComponent,
        ExportDrawingDialogComponent,
        DrawingComponent,
        AlertDialogComponent,
        ConfirmDialogComponent,
        GridComponent,
        GridTAPComponent,
        SelectionTAPComponent
    ],
    // Dialog
    entryComponents: [
        CreateDrawingDialogComponent,
        SaveDrawingDialogComponent,
        ExportDrawingDialogComponent,
        AlertDialogComponent,
        ConfirmDialogComponent
    ],
    imports: [ MatProgressSpinnerModule,
        MatSidenavModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatChipsModule,
        MatIconModule,
        MatButtonToggleModule,
        FormsModule,
        MatSelectModule,
        MatSliderModule,
        MatDividerModule,
        MatCardModule,
        MatRadioModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        RouterModule.forRoot([
            {
                path: '',
                component: MainMenuComponent
            },
            {
                path: 'workzone',
                component: WorkZoneComponent
            },
            {
                path: 'gallery',
                component: GalleryComponent
            },
            {
                path: 'returnButton',
                component: DrawMenuComponent

            },
            {
                path: 'userguide',
                component: UserGuideComponent
            }

    ]), AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
