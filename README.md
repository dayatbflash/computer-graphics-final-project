# computer-graphics-final-project
Final Project Assignment for Computer Graphics Course

### Struktur SourceCode
Pada Tugas Akhir ini, kami hanya menggunakan satu file .html dan .js yaitu index.html dan index.js

### User Manual
Sudah tersedia Modifier untuk masing












### Proses Pembentukan Objek
Ketiga objek hierarchy dibentuk dari beberapa cube yang diatur oleh matriks transformasi (scale, translate, rotate).
Dalam pembentukannya, yang pertama kali dilakukan yaitu membuat cube dengan menjalankan fungsi colorCube().
Dari cube yang sudah dibuat, diatur ukuran, posisi, dan arahnya dengan menggunakan matriks transformasi (modelViewMatrix) yang nanti akan dikalikan dengan vektor posisi (vPosition) dan vektor proyeksi (projectionMatrix) sehingga membentuk gl_Position untuk cube tersebut.


### Proses Rendering Objek dari Scene