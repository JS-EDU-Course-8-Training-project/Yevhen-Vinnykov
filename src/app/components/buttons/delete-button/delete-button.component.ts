import { firstValueFrom } from 'rxjs';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { DeleteButtonStore } from './delete-button.store';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss', '../buttons.scss'],
})
export class DeleteButtonComponent extends TestedComponent {
  @Input() slug!: string;

  constructor(
    private redirectionService: RedirectionService,
    private articlesService: ArticlesService,
    private matDialog: MatDialog,
    public store: DeleteButtonStore
  ) {
    super();
  }

  public async deleteArticle(): Promise<void> {
    const shouldDelete = await this.confirm();
    if (!shouldDelete) return;

    this.store.isLoading$.next(true);
    try {
      await this.articlesService.deleteArticle(this.slug);
      this.redirectionService.redirectHome();
    } catch (error) {
      console.log(error);
    } finally {
      this.store.isLoading$.next(false);
    }
  }

  private async confirm() {
    const dialogData = {
      title: 'Are you sure you want to delete this article?',
      subtitle: 'It cannot be restored',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    };

    const ref = this.matDialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });

    return await firstValueFrom(ref.afterClosed());
  }
}
