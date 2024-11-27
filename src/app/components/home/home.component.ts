import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  grid: number[] = []; // Array for squares
  newSquares: number = 0; // Input for new squares
  squaresToDelete: number = 0; // Input for deleting squares
  selectedSquares: Set<number> = new Set(); // Track selected square indices
  firstClickedIndex: number | null = null; // Track the first square clicked
  lastClickedIndex: number | null = null; // Track the last clicked square for reverse selection
  columns = 5; // Default number of columns for larger screens
  isShiftPressed = false; // Flag to track Shift key state
  isAltPressed = false; // Flag to track Alt key state
  isCtrlPressed = false; // Flag to track Ctrl key state

  ngOnInit(): void {
    const email = sessionStorage.getItem('email');
    console.log('User logged in:', email);
    
    // Initial grid setup based on window size
    this.updateGrid();
    window.addEventListener('resize', this.updateGrid.bind(this)); // Listen for resize events
    window.addEventListener('keydown', this.handleKeydown.bind(this)); // Listen for keydown events
    window.addEventListener('keyup', this.handleKeyup.bind(this)); // Listen for keyup events
  }

  ngOnDestroy(): void {
    // Clean up the event listeners to prevent memory leaks
    window.removeEventListener('keydown', this.handleKeydown.bind(this));
    window.removeEventListener('keyup', this.handleKeyup.bind(this));
    window.removeEventListener('resize', this.updateGrid.bind(this));
  }

  updateGrid(): void {
    const width = window.innerWidth;
    
    // Adjust the number of squares based on screen width
    if (width <= 600) { // Phone
      this.columns = 4; // 4 columns for phone
      this.grid = Array.from({ length: 8 }, (_, i) => i + 1); // 8 squares for phone
    } else if (width <= 1024) { // Tablet
      this.columns = 6; // 6 columns for tablet
      this.grid = Array.from({ length: 12 }, (_, i) => i + 1); // 12 squares for tablet
    } else { // Desktop
      this.columns = 5; // 5 columns for desktop
      this.grid = Array.from({ length: 25 }, (_, i) => i + 1); // 25 squares for desktop
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.isShiftPressed = true;
    }
    if (event.key === 'Alt') {
      this.isAltPressed = true;
    }
    if (event.key === 'Control') {
      this.isCtrlPressed = true; // Set the Ctrl flag when Ctrl is pressed
    }
  }

  handleKeyup(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.isShiftPressed = false;
    }
    if (event.key === 'Alt') {
      this.isAltPressed = false;
    }
    if (event.key === 'Control') {
      this.isCtrlPressed = false; // Unset the Ctrl flag when Ctrl is released
    }
  }

  addSquares(): void {
    if (this.newSquares > 0) {
      const currentLength = this.grid.length;
      const newItems = Array.from(
        { length: this.newSquares },
        (_, i) => currentLength + i + 1
      );
      this.grid = [...this.grid, ...newItems]; // Add new squares
      this.newSquares = 0; // Reset input field
    }
  }

  deleteSquares(): void {
    if (this.squaresToDelete > 0) {
      const currentLength = this.grid.length;
      const newLength = Math.max(0, currentLength - this.squaresToDelete); // Avoid negative index
      this.grid = this.grid.slice(0, newLength); // Keep only the remaining squares
      this.squaresToDelete = 0; // Reset input field
    }
  }

  selectSquare(index: number, event: MouseEvent): void {
    const isCtrlPressed = this.isCtrlPressed; // Check the state of the Ctrl key

    // Deselect all previously selected squares on each new click if Ctrl is not pressed
    if (!isCtrlPressed) {
      this.selectedSquares.clear();
    }

    // Handle selection based on the state of Shift and Alt keys
    if (this.isAltPressed && this.firstClickedIndex !== null) {
      // Alt is pressed: Select all squares between the first clicked and current in columns
      const startRow = Math.floor(this.firstClickedIndex / this.columns);
      const endRow = Math.floor(index / this.columns);
      const startColumn = Math.min(
        this.firstClickedIndex % this.columns,
        index % this.columns
      );
      const endColumn = Math.max(
        this.firstClickedIndex % this.columns,
        index % this.columns
      );

      // Loop through the rows and columns to select the squares
      for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
        for (let col = startColumn; col <= endColumn; col++) {
          const squareIndex = row * this.columns + col;
          if (squareIndex < this.grid.length) {
            this.selectedSquares.add(squareIndex);
          }
        }
      }
    } else if (this.isShiftPressed && this.firstClickedIndex !== null) {
      // Shift is pressed: Select all squares between the first clicked and current in rows
      const start = Math.min(this.firstClickedIndex, index);
      const end = Math.max(this.firstClickedIndex, index);
      for (let i = start; i <= end; i++) {
        this.selectedSquares.add(i);
      }
    } else if (isCtrlPressed) {
      // Ctrl is pressed: Select multiple squares independently
      if (this.selectedSquares.has(index)) {
        this.selectedSquares.delete(index); // Deselect if already selected
      } else {
        this.selectedSquares.add(index); // Select the square
      }
    } else {
      // Regular click: Select only the clicked square
      this.selectedSquares.add(index);
      this.firstClickedIndex = index; // Track this square as the first clicked
      this.lastClickedIndex = index; // Store last clicked index for reverse selection
    }
  }

  reverseSelection(index: number): void {
    // Logic to reverse the selection from last clicked to the current index (Shift or Alt)
    if (this.firstClickedIndex !== null) {
      if (this.lastClickedIndex !== null) {
        const start = Math.min(this.lastClickedIndex, index);
        const end = Math.max(this.lastClickedIndex, index);
        this.selectedSquares.clear();
        for (let i = start; i <= end; i++) {
          this.selectedSquares.add(i);
        }
      }
    }
  }

  resetPage(): void {
    this.updateGrid(); // Reset the grid based on the current screen size
    this.newSquares = 0; 
    this.squaresToDelete = 0; 
    this.selectedSquares.clear();
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}