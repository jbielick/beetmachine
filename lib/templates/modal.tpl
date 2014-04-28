<div class="modal-dialog">
	<div class="modal-content">
		<div class="modal-header">
			<a href="javascript:void(0)" class="close right" data-dismiss="modal" aria-hidden="true">&times;</a>
			<h4 class="modal-title" data-bind="title">Modal title</h4>
		</div>
		<div class="modal-body" data-bind="body">
		</div>
		<div class="modal-footer">
<%
			if (cancel) {
%>
			<a data-dismiss="modal" data-bind="close" data-behavior="close" class="btn"><%= typeof cancel === 'string' ? cancel : 'Close' %></a>
<%
			}
			if (action) {
%>
			<a data-dismiss="modal" data-bind="action" data-behavior="action" class="btn"><%= typeof action === 'string' ? action : 'Continue' %></a>
<%
			}
%>
		</div>
	</div>
</div>