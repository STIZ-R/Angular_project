import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';
import { Tag } from '../tag';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule, FormsModule, TagComponent],
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})

export class TagsComponent implements OnInit {
  loaded: boolean = false;
  tags: Tag[] = [];
  editing: Tag | null = null;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    if (!this.loaded) {
      this.tags = this.storageService.getTags();
      this.loaded = true;
    }
  }

  startAddTag(): void {
    this.editing = { id: 0, name: '', color: '#000000' };
  }

  startEditTag(id: number): void {
    const tag = this.tags.find(t => t.id === id);
    if (tag) {
      this.editing = { ...tag };
    }
  }

  saveTag(): void {
    if (!this.editing || !this.editing.name.trim()) {
      alert('Le nom du tag est requis.');
      return;
    }

    if (this.editing.id === 0) {
      const newTag = this.storageService.createTag(this.editing.name, this.editing.color);
      if (!newTag) {
        alert('Tag déjà existant ou invalide !');
        return;
      }
    } else {
      if (!this.storageService.updateTag(this.editing.id, this.editing.name, this.editing.color)) {
        alert('Nom déjà utilisé ou invalide !');
        return;
      }
    }

    this.tags = this.storageService.getTags();
    this.editing = null;
  }

  cancelEdit(): void {
    this.editing = null;
  }

  removeTag(id: number): void {
      if (this.storageService.deleteTag(id)) {
        this.tags = this.storageService.getTags();
      } else {
        alert('Erreur lors de la suppression du tag.');
      }
  }
}
