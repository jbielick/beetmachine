<div class="modal-dialog">
	<div class="modal-content">
		<div class="modal-header">
			<a href="javascript:void(0)" class="close right" data-dismiss="modal" aria-hidden="true">&times;</a>
			<h4 class="modal-title">Sound Editor: <span lg-bind="name"></span></h4>
		</div>
		<div class="modal-body">
			<form class="form-horizontal" onsubmit="return false">
				<div class="form-group">
					<div class="col-xs-12">
						<label>Name</label>
						<input class="form-control" type="text" placeholder="" lg-bind="name" />
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-12">
						<label>Source</label>
						<input class="form-control readonly" readonly type="text" placeholder="" lg-bind="src" />
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12">
						<canvas width="558" height="100" class="waveform" alt="Click to preview">No Pad or Not Rendered Yet</canvas>
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-6">
						<label>Key Trigger:</label>
						<input class="form-control" type="text" placeholder="" lg-bind="keyCode" />
					</div>
					<div class="col-xs-6">
						<div class="row collapse">
							<label>Effects</label>
							<div class="col-xs-9">
								<input class="form-control" type="text" placeholder="" />
							</div>
						</div>
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-12">
						<div class="btn-group btn-group-justified">
							<a class="btn btn-squishy btn-sm active" href="#editor/<%= data.pad %>-eq" data-behavior="tab" data-tab=".eq">EQ</a>
							<a class="btn btn-squishy btn-sm" href="#editor/<%= data.pad %>-reverb" data-behavior="tab" data-tab=".reverb">Reverb</a>
							<a class="btn btn-squishy btn-sm" href="#editor/<%= data.pad %>-delay" data-behavior="tab" data-tab=".delay">Delay</a>
							<a class="btn btn-squishy btn-sm" href="#editor/<%= data.pad %>-chorus" data-behavior="tab" data-tab=".chorus">Chorus</a>
						</div>
						<div class="tab-content">
							<div class="tab-pane eq" <%= !view.show ? 'lg' : '' %>>
								<canvas style="width:100%;height:100px;" class="eqform"></canvas>
								<div class="form-group">
									<div class="col-xs-12">
											<label>hpf</label>
											<input type="range" class="eq" data-param="hpf" min="-20" max="20" step="0.5">
											<label>lf</label>
											<input type="range" class="eq" data-param="lf" min="-20" max="20" step="0.5">
											<label>lmf</label>
											<input type="range" class="eq" data-param="lmf" min="-20" max="20" step="0.5">
											<label>mf</label>
											<input type="range" class="eq" data-param="mf" min="-20" max="20" step="0.5">
											<label>hmf</label>
											<input type="range" class="eq" data-param="hmf" min="-20" max="20" step="0.5">
											<label>hf</label>
											<input type="range" class="eq" data-param="hf" min="-20" max="20" step="0.5">
											<label>lpf</label>
											<input type="range" class="eq" data-param="lpf" min="-20" max="20" step="0.5">
										</div>
								</div>
							</div>
							<div class="tab-pane reverb" <%= view.show === 'reverb' ? '' : 'hidden' %>>
								<% if (data.fx && data.fx.reverb) { %>
									<div class="form-group">
										<div class="col-xs-12 text-right">
												<a class="btn btn-squishy btn-sm" data-behavior="toggleEffect" data-effect="reverb">Disable Reverb</a>
										</div>
									</div>
									<div class="form-group">
										<div class="col-xs-4">
											<label>Room <span class="label label-default" lg-bind="fx.reverb.room"><%= data.fx.reverb.room %></span></label>
											<input type="range" lg-bind="fx.reverb.room" min="0" max="2" step="0.1">
										</div>
										<div class="col-xs-4">
											<label>Wet/Dry <span class="label label-default" lg-bind="fx.reverb.damp"><%= data.fx.reverb.damp %></span></label>
											<input type="range" lg-bind="fx.reverb.damp" min="0" max="1" step="0.1">
										</div>
										<div class="col-xs-4">
											<label>Mix <span class="label label-default" lg-bind="fx.reverb.mix"><%= data.fx.reverb.mix %></span></label>
											<input type="range" lg-bind="fx.reverb.mix" min="0" max="1" step="0.01">
										</div>
									</div>
								<% } else { %>
									<div class="form-group">
										<div class="col-xs-12">
												<a class="btn btn-squishy btn-sm" data-behavior="toggleEffect" data-effect="reverb">Enable Reverb</a>
										</div>
									</div>
								<% } %>
							</div>
							<div class="tab-pane delay" <%= view.show === 'delay' ? '' : 'hidden' %>>
								<% if (data.fx && data.fx.delay) { %>
									<div class="form-group">
										<div class="col-xs-12 text-right">
												<a class="btn btn-squishy btn-sm" data-behavior="toggleEffect" data-effect="delay">Disable Delay</a>
										</div>
									</div>
									<div class="form-group">
										<div class="col-xs-4">
											<label>Time <span class="label label-default" lg-bind="fx.delay.time"><%= data.fx.delay.time %></span></label>
											<input type="range" lg-bind="fx.delay.time" min="10" max="1250" step="10">
										</div>
										<div class="col-xs-4">
											<label>Feedback <span class="label label-default" lg-bind="fx.delay.fb"><%= data.fx.delay.fb %></span></label>
											<input type="range" lg-bind="fx.delay.fb" min="-1" max="1" step="0.1">
										</div>
										<div class="col-xs-1">
											<label>Cross Delay <span class="label label-default" lg-bind="fx.delay.cross"><%= data.fx.delay.cross %></span></label>
											<input type="range" lg-bind="fx.delay.cross" min="0" max="1" step="0.01">
										</div>
										<div class="col-xs-3">
											<label>Mix <span class="label label-default" lg-bind="fx.delay.mix"><%= data.fx.delay.mix %></span></label>
											<input type="range" lg-bind="fx.delay.mix" min="0" max="1" step="0.01">
										</div>
									</div>
									<% } else { %>
									<div class="form-group">
										<div class="col-xs-12">
												<a class="btn btn-squishy btn-sm" data-behavior="toggleEffect" data-effect="delay">Enable Delay</a>
										</div>
									</div>
									<% } %>
							</div>
							<div class="tab-pane chorus" <%= view.show === 'chorus' ? '' : 'hidden' %>>
							<% if (data.fx && data.fx.chorus) { %>
									<div class="form-group">
										<div class="col-xs-12 text-right">
												<a class="btn btn-squishy btn-sm" data-behavior="toggleEffect" data-effect="chorus">Disable Chorus</a>
										</div>
									</div>
									<label>Type <span class="label label-default" lg-bind="fx.chorus.type"><%= data.fx.chorus.type %></span></label>
											<select lg-bind="fx.chorus.type" class="form-control">
												<option value="sin">Sin</option>
												<option value="tri">Tri</option>
											</select>
									<div class="form-group">
										<div class="col-xs-4">
											<label>Delay <span class="label label-default" lg-bind="fx.chorus.delay"><%= data.fx.chorus.delay %></span></label>
											<input type="range" lg-bind="fx.chorus.delay" min="0.5" max="80" step="0.5">
										</div>
										<div class="col-xs-4">
											<label>Rate <span class="label label-default" lg-bind="fx.chorus.rate"><%= data.fx.chorus.rate %></span></label>
											<input type="range" lg-bind="fx.chorus.rate" min="0" max="10" step="0.5">
										</div>
										<div class="col-xs-4">
											<label>Depth <span class="label label-default" lg-bind="fx.chorus.depth"><%= data.fx.chorus.depth %></span></label>
											<input type="range" lg-bind="fx.chorus.depth" min="0" max="100" step="1">
										</div>
									</div>
									<div class="form-group">
										<div class="col-xs-4">
											<label>Feedback <span class="label label-default" lg-bind="fx.chorus.fb"><%= data.fx.chorus.fb %></span></label>
											<input type="range" lg-bind="fx.chorus.fb" min="-1" max="1" step="0.1">
										</div>
										<div class="col-xs-4">
											<label>Wet <span class="label label-default" lg-bind="fx.chorus.wet"><%= data.fx.chorus.wet %></span></label>
											<input type="range" lg-bind="fx.chorus.wet" min="0" max="1" step="0.01">
										</div>
										<div class="col-xs-4">
											<label>Mix <span class="label label-default" lg-bind="fx.chorus.mix"><%= data.fx.chorus.mix %></span></label>
											<input type="range" lg-bind="fx.chorus.mix" min="0" max="1" step="0.01">
										</div>
									</div>
									<% } else { %>
									<div class="form-group">
										<div class="col-xs-12">
												<a class="btn btn-squishy btn-sm" data-behavior="toggleEffect" data-effect="chorus">Enable Chorus</a>
										</div>
									</div>
									<% } %>
							</div>
						</div>
					</div>
				</div>
				<div class="form-group">
					<div class="col-xs-12">
						<textarea class="form-control" placeholder=""></textarea>
					</div>
				</div>
			</form>
		</div>
		<div class="modal-footer">
			<a data-dismiss="modal" data-behavior="close" class="btn btn-sm btn-squishy">Cancel</a>
			<a data-dismiss="modal" data-behavior="save" class="btn btn-sm btn-squishy">Save</a>
		</div>
	</div>
</div>