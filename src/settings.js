import { getSetting, setSetting } from './utils.js';

import * as React from 'react';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const useState = React.useState;
const useEffect = React.useEffect;
const useLayoutEffect = React.useLayoutEffect;
const useMemo = React.useMemo;
const useCallback = React.useCallback;
const useRef = React.useRef;

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});
const lightTheme = createTheme({
	palette: {
		mode: 'light',
	},
});
const themes = {
	dark: darkTheme,
	light: lightTheme,
};

export function Settings(props) {
	const [theme, setTheme] = useState(document.body.classList.contains('ncm-light-theme') ? 'light' : 'dark');

	useEffect(() => {
		new MutationObserver(() => {
			if (document.body.classList.contains('ncm-light-theme')) {
				setTheme('light');
			} else {
				setTheme('dark');
			}
		}).observe(document.body, { attributes: true, attributeFilter: ['class'] });
	}, []);

	const [ model, setModel ] = useState(getSetting('openai-model', 'gpt-3.5-turbo'));
	const [ apiType, setApiType ] = useState(getSetting('api-type', 'custom'));
	const [ apiEndpoint, setApiEndpoint ] = useState(getSetting('custom-url', 'https://example.api.endpoint.lol/v1/'));
	const [ apiKey, setApiKey ] = useState(getSetting('custom-key', ''));

	return (
		<ThemeProvider theme={themes[theme]}>
			<div className='lyric-bar-settings' style={{padding: '15px'}}>
				<Stack direction="column" spacing={2}>
					<Typography gutterBottom>在没有中文翻译的歌词界面，点击右侧栏的 GPT 小图标以开始翻译</Typography>
					<FormGroup>					
						<Stack direction="column" spacing={2} alignItems="flex-start">
							<FormControl style={{ width: 'fit-content' }}>
								<FormLabel>API</FormLabel>
								<RadioGroup	row defaultValue={getSetting('api-type', 'custom')} onChange={(e) => {
									setApiType(e.target.value);
									setSetting('api-type', e.target.value);
								}}>
									<FormControlLabel value="custom" control={<Radio />} label="自定义API" />
									<FormControlLabel value="openai" control={<Radio />} label="官方API Key" />
								</RadioGroup>
							</FormControl>
							
							{
								apiType === 'custom' &&
									<TextField
										label="自定义API服务商地址"
										fullWidth
										variant="filled"
										defaultValue={getSetting('custom-url', 'https://chatgpt-api.shn.hk/v1/')}
										onChange={(e) => {
											setApiEndpoint(e.target.value);
											setSetting('custom-url', e.target.value);
										}}
										error={
											!apiEndpoint.startsWith('https://') &&
											!apiEndpoint.startsWith('http://')
										}
									/> 
									
							}
							{
								apiType === "custom" && <TextField
										label="API密钥"
										fullWidth
										variant="filled"
										defaultValue={getSetting('custom-key', '')}
										onChange={(e) => {
											setApiKey(e.target.value);
											setSetting('custom-key', e.target.value);
										}}
										error={false}
									/>
							}
							{
								apiType === "custom" && <TextField
										label="模型名"
										fullWidth
										variant="filled"
										defaultValue={getSetting('custom-model', '')}
										onChange={(e) => {
											setApiKey(e.target.value);
											setSetting('custom-model', e.target.value);
										}}
										error={false}
									/>
							}
							{
								apiType === 'openai' &&
									<TextField
										label="API密钥"
										fullWidth
										variant="filled"
										defaultValue={getSetting('openai-key', '')}
										onChange={(e) => {
											setApiKey(e.target.value);
											setSetting('openai-key', e.target.value);
										}}
										error={false}
									/> 
							}
							{
								apiType === 'openai' && <TextField
										label="模型名"
										fullWidth
										variant="filled"
										defaultValue={getSetting('openai-model', '')}
										onChange={(e) => {
											setApiKey(e.target.value);
											setSetting('openai-model', e.target.value);
										}}
										error={false}
									/>
							}
							
							<Button variant="outlined" onClick={async () => {
								await betterncm.fs.mkdir('gpt-translated-lyrics');
								await betterncm.app.exec(
									`explorer "${await betterncm.app.getDataPath()}\\gpt-translated-lyrics"`,
									false,
									true,
								);
							}}>打开缓存目录</Button>
						</Stack>
					</FormGroup>
				</Stack>
			</div>
		</ThemeProvider>
	);
}
