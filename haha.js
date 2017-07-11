<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!--------------------------------------------------------------------------------------------------------  -->
<!-- 新 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/bootstrap/css/bootstrap.min.css">

<!-- 可选的Bootstrap主题文件（一般不用引入） -->
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/bootstrap/css/bootstrap-theme.min.css">

<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="${pageContext.request.contextPath}/js/jquery-1.11.3.js"></script>

<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script
	src="${pageContext.request.contextPath}/bootstrap/js/bootstrap.min.js"></script>

<title>Insert title here</title>

<style type="text/css">
body {
	padding-top: 40px;
	padding-bottom: 40px;
	background-color: #eee;
}

.bg {
	max-width: 530px;
	padding: 15px;
	margin: 0 auto;
}
</style>

<script type="text/javascript">
	function addCustomer(){
		location.href = "${pageContext.request.contextPath}/addCustomer.jsp";
	}

	//两种方法，第一个，可以直接查数据库，第二个，发异步请求。我们这里用了第一个
	function delCustomer(customerId) {
		location.href = "${pageContext.request.contextPath}/customer/delCustomer?id="+customerId;
	}

	/*
		此时我们声明一下全局变量。因为我们不仅仅要传入customerId了
	*/
	var currPage = 1;
	var totalPage = 0;
	var totalCount = 0;
	var pageSize = 5;
	//根据客户id查询订单的操作，我们采用异步操作
/*
 * 没加pagination之前
 function findOrder(customerId) {
		$.post("${pageContext.request.contextPath}/order/findOrder",{'customerId':customerId},function(data){
			//[{"customer":{"cusName":"fox"},"orderNum":"123dafdafa","price":1234,"receiverInfo":"bj"},
			// {"customer":{"cusName":"fox"},"orderNum":"098sdjfdls","price":4321,"receiverInfo":"sh"}]

			var jsonObj = eval(data); //eval解析json对象。 将json对象转换成js对象。data是一个字符串
			var html="";

			for(var i=0; i<jsonObj.length; i++){
				html+="<tr><td>"+jsonObj[i].orderNum+"</td><td>"+jsonObj[i].receiverInfo+"</td><td>"+jsonObj[i].price+"</td><td>"+jsonObj[i].customer.cusName+"</td><td><a href='#'>删除</a></td></tr>";
			}
			$("#msg").html(html);
		});
	}
*/

/*
 加了pagination后，

 {"currPage":1,"currentContent":[{"customer":{"cusName":"fox"},"orderNum":"098dafaf","price":4321,"receiverInfo":"sh"},{"customer":{"cusName":"fox"},"orderNum":"123dafdafa","price":1234,"receiverInfo":"bj"}],"pageSize":5,"totalCount":2,"totalPage":1}
  分解这个json
  1. "currPage":1
  2. "pageSize":5
  3. "totalCount":2,
  4. "totalPage":1
  5. "currentContent":ref
 		ref 等于 [x,y]
			x 等于 {"customer":{"cusName":"fox"},"orderNum":"098dafaf","price":4321,"receiverInfo":"sh"}
			y 等于 {"customer":{"cusName":"fox"},"orderNum":"123dafdafa","price":1234,"receiverInfo":"bj"}
 */
	var cid;
	function findOrder(customerId) {
	 	cid = customerId;
		$.post("${pageContext.request.contextPath}/order/findOrder",{'customerId':customerId,'currPage':currPage,'pageSize':pageSize},function(data){

			//加上转移符是为了区别js的()
			var json = eval("("+data+")"); //eval解析json对象。 将json对象转换成js对象。data是一个字符串
			var html="";

			var jsonObj=json.currentContent;
			for(var i=0; i<jsonObj.length; i++){
				html+="<tr><td>"+jsonObj[i].orderNum+"</td><td>"+jsonObj[i].receiverInfo+"</td><td>"+jsonObj[i].price+"</td><td>"+jsonObj[i].customer.cusName+"</td><td><a href='#'>删除</a></td></tr>";
			}
			$("#msg").html(html);


			//接下来是 分页信息处理
			//对上面的全局变量进行重新复制
			pageSize = json.pageSize;
			totalPage = json.totalPage;
			totalCount = json.totalCount;
			currPage = json.currPage;

			//展示分页component
/* 			<ul class="pagination">
				<li class="disabled"><a href="#">&laquo;</a></li>
				<li class="active"><a href="#">1 <span class="sr-only">(current)</span></a></li>
				<li><a href="#">2</a></li>
				<li><a href="#">3</a></li>
				<li><a href="#">4</a></li>
				<li><a href="#">5</a></li>
				<li><a href="#">&raquo;</a></li>
			</ul> */

			/*
			如果想👆的一样，$("#msg")直接带到了table标签里面。如果你能在ul标签上写一个#id，你也可以pageHtml="".其实作用就是为了locate tag!
			*/
			var pageHtml="<ul class=\"pagination\">";
			//1.判断是否可以向上翻页
			if(currPage==1){
				pageHtml+="<li class=\"disabled\"><a href=\"#\">&laquo;</a></li>";
			} else{
				pageHtml+="<li><a href=\"#\" onclick=\"prePage()\">&laquo;</a></li>";
			}
			//2.判断中间页码
			for(var i=1;i<=totalPage;i++){
				if(i==curr){
					pageHtml+="<li class=\"active\"><a href=\"#\" onclick=\"selectPage("+i+")\">"+i+"</a></li>";
				}else{
					pageHtml+="<li><a href=\"#\" onclick=\"selectPage("+i+")\">"+i+"</a></li>";
				}
			}
			//3.判断是否可以向下翻页
			if(currPage==totalPage){
				pageHtml+="<li class=\"disabled\"><a href=\"#\">&raquo;</a></li>";
			} else{
				pageHtml+="<li><a href=\"#\" onclick=\"nextPage()\">&raquo;</a></li>";
			}

			pageHtml+="</ul>";

		});

	}

 	//向上翻页
 	function prePage(){
 		currPage = currPage - 1;
 		findOrder(cid);
 	}
 	//向下翻页
 	function nextPage(){
		currPage = currPage + 1;
 		findOrder(cid);
 	}
 	//指定页跳转
 	function selectPage(currentPage){
 		currPage = currentPage;
 		findOrder(cid);
 	}


</script>
	<body>
 	</head>
	<table class="table table-hover table-bordered bg">
		<tr>
			<td colspan="4">
				<!-- <button type="button" class="btn btn-primary btn-lg active btn-sm"
					onclick="addCustomer()">Add Customer</button> --> <a
				href="${pageContext.request.contextPath}/addCustomer.jsp"
				class="btn btn-primary btn-lg active" role="button">Add Customer</a>
			</td>
		</tr>
		<tr>
			<td>序号</td>
			<td>客户</td>
			<td>客户名称</td>
			<td>联系电话</td>
			<td>操作</td>
		</tr>
		<s:iterator value="cs" var="c" status="vs">
			<tr>
				<td><s:property value="#vs.index+1" /></td>
				<td><img src="<s:property value='#c.cusImgsrc'/>"
					class="img-circle"></td>
				<td><s:property value="#c.cusName" /></td>
				<td><s:property value="#c.cusPhone" /></td>
				<td><a href="javascript:void(0)" class="btn btn-primary btn-sm"
					onclick="delCustomer(<s:property value="#c.id"/>)">删除客户</a> <a
					href="javascript:void(0)"
					onclick="findOrder(<s:property value="#c.id"/>)"
					class="btn btn-primary btn-sm" data-toggle="modal"
					data-target="#myModal">订单详情</a></td>
			</tr>
		</s:iterator>

	</table>

	<!-- Modal -->
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">订单详情</h4>
				</div>
				<div class="modal-body">
					<table class="table table-bordered .table-hover">
						<tr>
							<td>订单编号</td>
							<td>收货地址</td>
							<td>订单价格</td>
							<td>客户名称</td>
							<td>操作</td>
						</tr>
						<tbody id="msg">

						</tbody>
					</table>
				</div>
				<div class="modal-footer">
					<nav id="page"> </nav>
				</div>
			</div>
		</div>
	</div>

</body>
</html>
