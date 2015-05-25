//----------------------------------------------------------------------
// PCL's Nice Tooltip 1.0.0
// Copyright (C) ManHunter / PCL
// manhunter.ru
//
// ������ ������� ������������� � ���������:
// - Internet Explorer 6,7; TheWorld, MyIE2/Maxthon, Avant Browser
// - Opera 7,8,9
// - Mozilla Firefox 2,3; K-Meleon
// - Netscape 8,9
// - Google Chrome, Safari, Iron
//----------------------------------------------------------------------

// ��� ����� ��������� ������������� ���������
var tooltiptags = ['span'];

var global_hook=0;
var tooltip_lehgth=0;

//----------------------------------------------------------------------
// �������� ����������� ���������
//----------------------------------------------------------------------
function PCL_TooltipShow(e) {
  // ���� tooltip �� ������������, �� � �� ������������ ������
  if (global_hook==0) { return; }

  // �������� �������
  var e = e ? e : window.event;

  var doc = document.documentElement;
  var body = document.body;

  // �������� ������� ���������� ����
  // ������������ �������� ����� ����������� IE �� Gareth Heyes
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

  // �������� ������� ������� ������� ������
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

  // ���� ������ "�������" ������ ��������� �������, �� ����������
  // ������ ��������� ��������� �������, ����� ���������� ������
  // "�������". ��� ��������� ��������� ������� tooltip'� � ����
  // ������ ��� � ������������� ������������ �������.
  if (rr.offsetWidth>tooltip_lehgth) {
    dd.style.width=tooltip_lehgth+'px';
    dd.style.whiteSpace='normal';
  }
  else {
    dd.style.width='auto';
    dd.style.whiteSpace='nowrap';
  }

  // ������������� �������� �� ���������
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

  // ������������� �������� �� �����������
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

  // �������� ������� tooltip'�
  var div_width = dd.offsetWidth;
  var div_height = dd.offsetHeight;
  
  // ��������� ����� ���������� tooltip'�
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
    // ���������� ����� ���������� tooltip'�
    style.left=(new_x+scrollX)+'px';
    style.top=(new_y+scrollY)+'px';
    // ������� ���������� �������� � Opera
    style.visibility = 'visible';
  }
}

//----------------------------------------------------------------------
// ���������� ��������� ������� ���� �� �������
//----------------------------------------------------------------------
function PCL_TooltipMouseOver(e) {
  var x = e.target ? e.target : e.srcElement;
  var dd = document.getElementById('tooltipdiv');
  // �������� ����� ��������� � �������� � ��������������� DIV
  dd.innerHTML=x.getAttribute('tooltip');
  var rr = document.getElementById('rulediv');
  rr.innerHTML=dd.innerHTML;
  // ��������� ��������� ����������� ����
  global_hook=1;
}

//----------------------------------------------------------------------
// ���������� ����� ������� ���� � ��������
//----------------------------------------------------------------------
function PCL_TooltipMouseOut(e) {
  var dd = document.getElementById('tooltipdiv');
  // �������� ���������
  dd.style.visibility = 'hidden';
  // ��������� ��������� ����������� ����
  global_hook=0;
}

//----------------------------------------------------------------------
// ���������� tooltip'�� �� ��������, �������� ��� ������ ������ �������
// ��� ����� ������������� ����� ������� AJAX
//----------------------------------------------------------------------
function PCL_TooltipUpdate() {
  for (var i=0; i<tooltiptags.length; i++) {
    element = document.getElementsByTagName(tooltiptags[i]);
    for (var j=0; j<element.length; j++) {
      var x=element[j];
      // ���� ���������� ������� alt ��� title, �� ���������� ��� ����������
      if ((typeof(x.alt)=='string' && x.alt!='') ||
          (typeof(x.title)=='string' && x.title!='')) {
        // ������� �������������� ������� 'hint' � �������� � ���� ��������
        if (typeof(x.title)=='string' && x.title!='') {
          x.setAttribute('tooltip',x.title);
          x.tooltip=x.title;
        }
        else {
          x.setAttribute('tooltip',x.alt);
          x.tooltip=x.alt;
        }
        // �������� �������� alt � title, ����� ��������� �� �������������
        // �������� ���������� ��������
        x.setAttribute('alt','');
        x.alt='';
        x.setAttribute('title','');
        x.title=''

        // ���������� ��� �������� ����������� ������� �� ��������� �
        // ����� ������� ����
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
  // ��� ���������� � ������������� ������������� �������� ���������
  var dd = document.getElementById('tooltipdiv');
  dd.style.visibility = 'hidden';
  global_hook=0;
}

//----------------------------------------------------------------------
// ������������� �������. ��� ������� ������ ���������� �� �������
// onload ��� ���������� � ����� ����� ��������
//----------------------------------------------------------------------
function PCL_TooltipInit() {
  // ���������� ������ ���������, �� ��������� 300
  tooltip_lehgth=(typeof(arguments[0])!='number'?300:arguments[0]);
  if (tooltip_lehgth<10) { tooltip_lehgth=300; }

  // ���������� ���������� ����������� ����
  var element = document.getElementsByTagName('html')[0];
  if (element.addEventListener) {
    element.addEventListener("mousemove", PCL_TooltipShow, false);
  }
  else {
    element.attachEvent("onmousemove", PCL_TooltipShow);
  }

  if (!document.getElementById('tooltipdiv')) {
    // �������� �� �������� ��������� DIV � ����������
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

    // �������� �� �������� ��������������� DIV ��� ������� �������
    // ������� ���� ���������
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

  // ���������������� tooltip'� �� ��������
  PCL_TooltipUpdate();
}
