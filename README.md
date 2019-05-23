# computer-graphics-final-project
Final Project Assignment for Computer Graphics Course


### Struktur Source Code
Pada Tugas Akhir ini, kami hanya menggunakan satu file .html dan .js yaitu index.html dan index.js


### User Manual
Sudah tersedia Modifier untuk masing - masing objek sehingga user dapat mengganti angle masing - masing joint dari objek hierarchy atau rotasi dari objek static.

Seperti contoh pada objek Cube, dapat diubah rotasi x, y, dan z dari cube. Lalu untuk objek Hand dapat diubah angle joint dari masing-masing jari.

Terdapat pula Tombol Toggle Animasi dari masing-masing objek, jika ditekan akan memulai animasi objek tersebut. Keadaan angle yang ada pada slider akan disimpan sebelum melakukan animasi, sehingga jika animasi diselesaikan, akan kembali ke posisi yang sudah ditentukan oleh user dengan slider. Posisi animasi juga disimpan sehingga jika animasi dijalankan kembali, animasi akan berlanjut dari posisi animasi yang terakhir.

Terdapat tombol Toggle Texture yang berguna untuk mengubah texture dari objek-objek yang ada dari texture material ke wirefram, dan sebaliknya.

Terdapat tombol Toggle Camera Mode yang berguna untuk mengubah posisi camera dari yang berada di ruangan dan melihat ke objek-objek menjadi camera yang berada pada head dari robot, dan sebaliknya.


### Proses Pembentukan Objek
Dalam pembentukannya, yang pertama kali dilakukan yaitu membuat cube dengan menjalankan fungsi colorCube().
Dari cube yang sudah dibuat, diatur ukuran, posisi, dan arahnya dengan menggunakan matriks transformasi (modelViewMatrix) yang nanti akan dikalikan dengan vektor posisi (vPosition) dan vektor proyeksi (projectionMatrix) sehingga membentuk gl_Position untuk cube tersebut.

Dalam pembentukan objek hierarchy, objek tersebut terbentuk dari beberapa bagian objek. Seperti pada kasusnya objek Robot, objek tersebut dibentuk oleh beberapa bagian, yaitu torso, head, upperArm, lowerArm, upperLeg, lowerLeg. Tiap bagian objek memiliki hierarchy-nya masing-masing, bagian objek yang memiliki hierarchy lebih rendah akan bergantung dengan modelViewMatrix dari objek atasnya yang kemudian dikalikan dengan matriks transformasinya.

Ketiga objek hierarchy dibentuk dari beberapa cube yang diatur oleh matriks transformasi (scale, translate, rotate).

Object hierarchy pertama (Hand) terdiri dari 11 cube dan 10 joint. 
Object hierarchy kedua (Robot) terdiri dari 10 cube dan 9 joint.
Object hierarchy ketiga (Dino) terdiri dari 9 cube dan 8 joint.
