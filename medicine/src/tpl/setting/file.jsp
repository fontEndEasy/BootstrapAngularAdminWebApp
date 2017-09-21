<%@ page contentType="text/html; charset=UTF-8"%>
	<form id='fileForm' style='padding: 5px 20px' target='upload'
		action='/web/file/upload.jsp?<%=new hippo.common.data.BinaryString()%>/goods_image' method='post' enctype="multipart/form-data">
		<table>
			<tr>
				<td nowrap>文件</td>
				<td><input id="FILE_UPLOAD" name='FILE_UPLOAD' type='file' size='30'></td>
				<td><input type="submit" name="上传"/></td>
			</tr>
		</table>
	</form>
	