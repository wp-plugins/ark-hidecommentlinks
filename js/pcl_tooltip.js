//----------------------------------------------------------------------
// PCL's Nice Tooltip 1.0.0
// Copyright (C) ManHunter / PCL
// manhunter.ru
//
// Скрипт успешно протестирован в браузерах:
// - Internet Explorer 6,7; TheWorld, MyIE2/Maxthon, Avant Browser
// - Opera 7,8,9
// - Mozilla Firefox 2,3; K-Meleon
// - Netscape 8,9
// - Google Chrome, Safari, Iron
//----------------------------------------------------------------------

// Для каких элементов устанавливать подсказки
var tooltiptags = ['span'];

var global_hook=0;
var tooltip_lehgth=0;

//----------------------------------------------------------------------
// Показать всплывающую подсказку
//----------------------------------------------------------------------
function PCL_TooltipShow(e) {
  // Если tooltip не показывается, то и не обрабатывать ничего
  if (global_hook==0) { return; }

  // Получить событие
  var e = e ? e : window.event;

  var doc = document.documentElement;
  var body = document.body;

  // Получить текущие координаты мыши
  // Используется короткий метод определения IE от Gareth Heyes
  if ("\v" == "v") {
    var mouse_x = e.clientX;
    if (doc.clientLeft) { mouse_x -= doc.clientLeft; }
    if (doc && doc.scrollLeft) { mouse_x += doc.scrollLeft; }
    if (body && body.scrollLeft) { mouse_x += body.scrollLeft; }
    var mouse_y = e.clientY;
    if (doc.clientTop) { mouse_y -=doc.clientTop; }
    if (doc && doc.scrollTop) { mouse_y += doc.scrollTop; }
    if (body && body.scrollTop) { mouse_y += body.scrollTop; }
  }
  else {
    var mouse_x=e.pageX;
    var mouse_y=e.pageY;
  }

  var my_width = 0;
  var my_height = 0;

  // Получить размеры видимой области экрана
  if (typeof(window.innerWidth) == 'number') {
    my_width = window.innerWidth;
    my_height = window.innerHeight;
  }
  else if (doc && (doc.clientWidth || doc.clientHeight)) {
    my_width = doc.clientWidth;
    my_height = doc.clientHeight;
  }
  else if (body && (body.clientWidth || body.clientHeight)) {
    my_width = body.clientWidth;
    my_height = body.clientHeight;
  }

  var dd = document.getElementById('tooltipdiv');
  var rr = document.getElementById('rulediv');

  // Если ширина "рулетки" больше заданного размера, то установить
  // ширину подсказки заданного размера, иначе установить ширину
  // "рулетки". Это устраняет искажение размера tooltip'а у края
  // экрана или в горизонтально прокрученной области.
  if (rr.offsetWidth>tooltip_lehgth) {
    dd.style.width=tooltip_lehgth+'px';
    dd.style.whiteSpace='normal';
  }
  else {
    dd.style.width='auto';
    dd.style.whiteSpace='nowrap';
  }

  // Относительное смещение по вертикали
  var scrollY = 0;
  if (doc && doc.scrollTop) {
    scrollY = doc.scrollTop;
  }
  else if (body && body.scrollTop) {
    scrollY = body.scrollTop;
  }
  else if (window.pageYOffset) {
    scrollY = window.pageYOffset;
  }
  else if (window.scrollY) {
    scrollY = window.scrollY;
  }

  // Относительное смещение по горизонтали
  var scrollX = 0;
  if (doc && doc.scrollLeft) {
    scrollX = doc.scrollLeft;
  }
  else if (body && body.scrollLeft) {
    scrollX = body.scrollLeft;
  }
  else if (window.pageXOffset) {
    scrollX = window.pageXOffset;
  }
  else if (window.scrollX) {
    scrollX = window.scrollX;
  }

  mouse_y-=scrollY;
  mouse_x-=scrollX;

  // Получить размеры tooltip'а
  var div_width = dd.offsetWidth;
  var div_height = dd.offsetHeight;
  
  // Расчитать новые координаты tooltip'а
  if (mouse_y+div_height+40>my_height) {
    var new_y = my_height-div_height-20;
  }
  else {
    var new_y = mouse_y+20;
  }
  if (mouse_x+div_width+40>my_width) {
    var new_x = my_width-div_width-20;
  }
  else {
    var new_x = mouse_x+20;
  }

  with (dd) {
    // Установить новые координаты tooltip'а
    style.left=(new_x+scrollX)+'px';
    style.top=(new_y+scrollY)+'px';
    // Убирает неприятное мерцание в Opera
    style.visibility = 'visible';
  }
}

//----------------------------------------------------------------------
// Обработчик наведения курсора мыши на элемент
//----------------------------------------------------------------------
function PCL_TooltipMouseOver(e) {
  var x = e.target ? e.target : e.srcElement;
  var dd = document.getElementById('tooltipdiv');
  // Записать текст подсказки в основной и вспомогательный DIV
  dd.innerHTML=x.getAttribute('tooltip');
  var rr = document.getElementById('rulediv');
  rr.innerHTML=dd.innerHTML;
  // Разрешить обработку перемещения мыши
  global_hook=1;
}

//----------------------------------------------------------------------
// Обработчик ухода курсора мыши с элемента
//----------------------------------------------------------------------
function PCL_TooltipMouseOut(e) {
  var dd = document.getElementById('tooltipdiv');
  // Спрятать подсказку
  dd.style.visibility = 'hidden';
  // Запретить обработку перемещения мыши
  global_hook=0;
}

//----------------------------------------------------------------------
// Обновление tooltip'ов на странице, например при первом вызове скрипта
// или после использования ваших функций AJAX
//----------------------------------------------------------------------
function PCL_TooltipUpdate() {
  for (var i=0; i<tooltiptags.length; i++) {
    element = document.getElementsByTagName(tooltiptags[i]);
    for (var j=0; j<element.length; j++) {
      var x=element[j];
      // Если установлен атрибут alt или title, то установить наш обработчик
      if ((typeof(x.alt)=='string' && x.alt!='') ||
          (typeof(x.title)=='string' && x.title!='')) {
        // Создать дополнительный атрибут 'hint' и записать в него значение
        if (typeof(x.title)=='string' && x.title!='') {
          x.setAttribute('tooltip',x.title);
          x.tooltip=x.title;
        }
        else {
          x.setAttribute('tooltip',x.alt);
          x.tooltip=x.alt;
        }
        // Обнулить атрибуты alt и title, чтобы подсказка не дублировалась
        // штатными средствами браузера
        x.setAttribute('alt','');
        x.alt='';
        x.setAttribute('title','');
        x.title=''

        // Установить для элемента обработчики событий по наведению и
        // уходу курсора мыши
        if (x.addEventListener) {
          x.addEventListener("mouseover", PCL_TooltipMouseOver, false);
          x.addEventListener("mouseout", PCL_TooltipMouseOut, false);
        }
        else {
          x.attachEvent("onmouseover", PCL_TooltipMouseOver);
          x.attachEvent("onmouseout", PCL_TooltipMouseOut);
        }
      }
    }
  }
  // При обновлении и инициализации принудительно спрятать подсказку
  var dd = document.getElementById('tooltipdiv');
  dd.style.visibility = 'hidden';
  global_hook=0;
}

//----------------------------------------------------------------------
// Инициализация скрипта. Эта функция должна вызываться по событию
// onload или находиться в самом конце страницы
//----------------------------------------------------------------------
function PCL_TooltipInit() {
  // Установить ширину подсказки, по умолчанию 300
  tooltip_lehgth=(typeof(arguments[0])!='number'?300:arguments[0]);
  if (tooltip_lehgth<10) { tooltip_lehgth=300; }

  // Установить обработчик перемещения мыши
  var element = document.getElementsByTagName('html')[0];
  if (element.addEventListener) {
    element.addEventListener("mousemove", PCL_TooltipShow, false);
  }
  else {
    element.attachEvent("onmousemove", PCL_TooltipShow);
  }

  if (!document.getElementById('tooltipdiv')) {
    // Добавить на страницу плавающий DIV с подсказкой
    var tooltipDiv = document.createElement("DIV");
    document.getElementsByTagName('body')[0].appendChild(tooltipDiv);
    with (tooltipDiv) {
      setAttribute('id','tooltipdiv');
      className = 'tooltip';
      style.position = 'absolute';
      style.opacity = '.95';
      style.filter = "alpha(opacity:95)";
      style.zIndex=9999;
      style.visibility = 'hidden';
    }

    // Добавить на страницу вспомогательный DIV для расчета нужного
    // размера окна подсказки
    var ruleDiv = document.createElement("DIV");
    document.getElementsByTagName('body')[0].appendChild(ruleDiv);
    with (ruleDiv) {
      setAttribute('id','rulediv');
      className = 'tooltip';
      style.position = 'absolute';
      style.zIndex=0;
      style.top='1px';
      style.left='1px';
      style.visibility = 'hidden';
      innerHTML='&nbsp;';
    }
  }

  // Инициализировать tooltip'ы на странице
  PCL_TooltipUpdate();
}
