<template>
    <div class="center-container">
        <div class="form-container">
            <form @submit.prevent="updateSettings" class="form-content">
                <label>
                    Server IP
                    <TextInput
                        v-model="settings.ip"
                        placeholder="Enter Server IP"
                        @change="this.updateStatus = null"
                    >
                    </TextInput>
                </label>
                <label>
                    Server Connection Port
                    <TextInput
                        v-model="settings.connection_port"
                        placeholder="Enter Server Connection Port"
                        @change="this.updateStatus = null"
                    >
                    </TextInput>
                </label>
                <label>
                    Server Query Port
                    <TextInput
                        v-model="settings.query_port"
                        placeholder="Enter Server Query Port"
                        @change="this.updateStatus = null"
                    >
                    </TextInput>
                </label>
                <label>
                    Server Game
                    <DropdownInput
                        placeholder="Select the Server Game"
                        v-model="settings.game" 
                        :options="gameOptions" 
                        @change="getQueryProtocol"
                    >
                    </DropdownInput>
                </label>
                <button 
                    :class="{'success': updateStatus === 'success', 'error': updateStatus === 'error'}" 
                    type="submit"
                >
                    <span v-if="updateStatus === 'loading'" class="update-status">Updating...</span>
                    <span v-else-if="updateStatus === 'success'" class="update-status success"><i class="bi bi-check2-circle"></i></span>
                    <span v-else-if="updateStatus === 'error'" class="update-status error"><i class="bi bi-x-lg"></i></span>
                    <span v-else class="update-status">Update</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
    import axios from '../../jwtInterceptor';

    import TextInput from '../inputs/textInput'
    import DropdownInput from '../inputs/dropdownInput'

    export default {
        name: 'ServerSettingsComponent',
        props: ['serverData', 'guild_id', 'server_uuid'],
        components: {
            TextInput,
            DropdownInput,
        },
        data() {
            return {
                updateStatus: null,
                gameOptions: [
                    { value: '7 Days to Die', label: '7 Days to Die', queryProtocol: '7d2d' },
                    { value: 'Ace of Spades Classic', label: 'Ace of Spades Classic', queryProtocol: 'buildandshoot' },
                    { value: 'Age of Chivalry', label: 'Age of Chivalry', queryProtocol: 'ageofchivalry' },
                    { value: 'Age of Empires 2', label: 'Age of Empires 2', queryProtocol: 'aoe2' },
                    { value: 'Alien Arena', label: 'Alien Arena', queryProtocol: 'alienarena' },
                    { value: 'Alien Swarm', label: 'Alien Swarm', queryProtocol: 'alienswarm' },
                    { value: 'Aliens versus Predator 2', label: 'Aliens versus Predator 2', queryProtocol: 'avp2' },
                    { value: 'Aliens vs. Predator', label: 'Aliens vs. Predator', queryProtocol: 'avp2010' },
                    { value: 'America\'s Army', label: 'America\'s Army', queryProtocol: 'americasarmy' },
                    { value: 'America\'s Army 2', label: 'America\'s Army 2', queryProtocol: 'americasarmy2' },
                    { value: 'America\'s Army 3', label: 'America\'s Army 3', queryProtocol: 'americasarmy3' },
                    { value: 'America\'s Army: Proving Grounds', label: 'America\'s Army: Proving Grounds', queryProtocol: 'americasarmypg' },
                    { value: 'Arca Sim Racing', label: 'Arca Sim Racing', queryProtocol: 'arcasimracing' },
                    { value: 'Ark: Survival Evolved', label: 'Ark: Survival Evolved', queryProtocol: 'arkse' },
                    { value: 'ARMA 2', label: 'ARMA 2', queryProtocol: 'arma2' },
                    { value: 'ARMA 2: DayZ Mod', label: 'ARMA 2: DayZ Mod', queryProtocol: 'dayzmod' },
                    { value: 'ARMA 2: Operation Arrowhead', label: 'ARMA 2: Operation Arrowhead', queryProtocol: 'arma2oa' },
                    { value: 'ARMA 3', label: 'ARMA 3', queryProtocol: 'arma3' },
                    { value: 'ARMA: Armed Assault', label: 'ARMA: Armed Assault', queryProtocol: 'arma' },
                    { value: 'ARMA: Cold War Assault', label: 'ARMA: Cold War Assault', queryProtocol: 'armacwa' },
                    { value: 'ARMA: Resistance', label: 'ARMA: Resistance', queryProtocol: 'armar' },
                    { value: 'Armagetron Advanced', label: 'Armagetron Advanced', queryProtocol: 'armagetron' },
                    { value: 'Assetto Corsa', label: 'Assetto Corsa', queryProtocol: 'assettocorsa' },
                    { value: 'Atlas', label: 'Atlas', queryProtocol: 'atlas' },
                    { value: 'Baldur\'s Gate', label: 'Baldur\'s Gate', queryProtocol: 'baldursgate' },
                    { value: 'Barotrauma', label: 'Barotrauma', queryProtocol: 'barotrauma' },
                    { value: 'Battalion 1944', label: 'Battalion 1944', queryProtocol: 'bat1944' },
                    { value: 'Battlefield 1942', label: 'Battlefield 1942', queryProtocol: 'bf1942' },
                    { value: 'Battlefield 2', label: 'Battlefield 2', queryProtocol: 'bf2' },
                    { value: 'Battlefield 2142', label: 'Battlefield 2142', queryProtocol: 'bf2142' },
                    { value: 'Battlefield 3', label: 'Battlefield 3', queryProtocol: 'bf3' },
                    { value: 'Battlefield 4', label: 'Battlefield 4', queryProtocol: 'bf4' },
                    { value: 'Battlefield Hardline', label: 'Battlefield Hardline', queryProtocol: 'bfh' },
                    { value: 'Battlefield Vietnam', label: 'Battlefield Vietnam', queryProtocol: 'bfv' },
                    { value: 'Battlefield: Bad Company 2', label: 'Battlefield: Bad Company 2', queryProtocol: 'bfbc2' },
                    { value: 'Breach', label: 'Breach', queryProtocol: 'breach' },
                    { value: 'Breed', label: 'Breed', queryProtocol: 'breed' },
                    { value: 'Brink', label: 'Brink', queryProtocol: 'brink' },
                    { value: 'Build and Shoot', label: 'Build and Shoot', queryProtocol: 'buildandshoot' },
                    { value: 'Call of Duty', label: 'Call of Duty', queryProtocol: 'cod' },
                    { value: 'Call of Duty 2', label: 'Call of Duty 2', queryProtocol: 'cod2' },
                    { value: 'Call of Duty 3', label: 'Call of Duty 3', queryProtocol: 'cod3' },
                    { value: 'Call of Duty 4: Modern Warfare', label: 'Call of Duty 4: Modern Warfare', queryProtocol: 'cod4' },
                    { value: 'Call of Duty: Modern Warfare 2', label: 'Call of Duty: Modern Warfare 2', queryProtocol: 'codmw2' },
                    { value: 'Call of Duty: Modern Warfare 3', label: 'Call of Duty: Modern Warfare 3', queryProtocol: 'codmw3' },
                    { value: 'Call of Duty: United Offensive', label: 'Call of Duty: United Offensive', queryProtocol: 'coduo' },
                    { value: 'Call of Duty: World at War', label: 'Call of Duty: World at War', queryProtocol: 'codwaw' },
                    { value: 'Call of Juarez', label: 'Call of Juarez', queryProtocol: 'callofjuarez' },
                    { value: 'Chaser', label: 'Chaser', queryProtocol: 'chaser' },
                    { value: 'Chrome', label: 'Chrome', queryProtocol: 'chrome' },
                    { value: 'Codename Eagle', label: 'Codename Eagle', queryProtocol: 'codenameeagle' },
                    { value: 'Command and Conquer: Renegade', label: 'Command and Conquer: Renegade', queryProtocol: 'cacrenegade' },
                    { value: 'Commandos 3: Destination Berlin', label: 'Commandos 3: Destination Berlin', queryProtocol: 'commandos3' },
                    { value: 'Conan Exiles', label: 'Conan Exiles', queryProtocol: 'conanexiles' },
                    { value: 'Contagion', label: 'Contagion', queryProtocol: 'contagion' },
                    { value: 'Contract J.A.C.K.', label: 'Contract J.A.C.K.', queryProtocol: 'contactjack' },
                    { value: 'Counter-Strike 1.5', label: 'Counter-Strike 1.5', queryProtocol: 'cs15' },
                    { value: 'Counter-Strike 1.6', label: 'Counter-Strike 1.6', queryProtocol: 'cs16' },
                    { value: 'Counter-Strike: 2D', label: 'Counter-Strike: 2D', queryProtocol: 'cs2d' },
                    { value: 'Counter-Strike: Condition Zero', label: 'Counter-Strike: Condition Zero', queryProtocol: 'cscz' },
                    { value: 'Counter-Strike: Global Offensive', label: 'Counter-Strike: Global Offensive', queryProtocol: 'csgo' },
                    { value: 'Counter-Strike: Source', label: 'Counter-Strike: Source', queryProtocol: 'css' },
                    { value: 'Cross Racing Championship Extreme 2005', label: 'Cross Racing Championship Extreme 2005', queryProtocol: 'crossracing' },
                    { value: 'Crysis', label: 'Crysis', queryProtocol: 'crysis' },
                    { value: 'Crysis 2', label: 'Crysis 2', queryProtocol: 'crysis2' },
                    { value: 'Crysis Wars', label: 'Crysis Wars', queryProtocol: 'crysiswars' },
                    { value: 'Daikatana', label: 'Daikatana', queryProtocol: 'daikatana' },
                    { value: 'Dark and Light', label: 'Dark and Light', queryProtocol: 'dnl' },
                    { value: 'Dark Messiah of Might and Magic', label: 'Dark Messiah of Might and Magic', queryProtocol: 'dmomam' },
                    { value: 'Darkest Hour: Europe \'44-\'45', label: 'Darkest Hour: Europe \'44-\'45', queryProtocol: 'darkesthour' },
                    { value: 'Day of Defeat', label: 'Day of Defeat', queryProtocol: 'dod' },
                    { value: 'Day of Defeat: Source', label: 'Day of Defeat: Source', queryProtocol: 'dods' },
                    { value: 'Day of Dragons', label: 'Day of Dragons', queryProtocol: 'dayofdragons' },
                    { value: 'Day of Infamy', label: 'Day of Infamy', queryProtocol: 'doi' },
                    { value: 'Days of War', label: 'Days of War', queryProtocol: 'daysofwar' },
                    { value: 'DayZ', label: 'DayZ', queryProtocol: 'dayz' },
                    { value: 'Deadly Dozen: Pacific Theater', label: 'Deadly Dozen: Pacific Theater', queryProtocol: 'deadlydozenpt' },
                    { value: 'Deer Hunter 2005', label: 'Deer Hunter 2005', queryProtocol: 'dh2005' },
                    { value: 'Descent 3', label: 'Descent 3', queryProtocol: 'descent3' },
                    { value: 'Deus Ex', label: 'Deus Ex', queryProtocol: 'deusex' },
                    { value: 'Devastation', label: 'Devastation', queryProtocol: 'devastation' },
                    { value: 'Dino D-Day', label: 'Dino D-Day', queryProtocol: 'dinodday' },
                    { value: 'Dirt Track Racing 2', label: 'Dirt Track Racing 2', queryProtocol: 'dirttrackracing2' },
                    { value: 'Doom 3', label: 'Doom 3', queryProtocol: 'doom3' },
                    { value: 'Dota 2', label: 'Dota 2', queryProtocol: 'dota2' },
                    { value: 'Drakan: Order of the Flame', label: 'Drakan: Order of the Flame', queryProtocol: 'drakan' },
                    { value: 'Empyrion - Galactic Survival', label: 'Empyrion - Galactic Survival', queryProtocol: 'empyrion' },
                    { value: 'Enemy Territory: Quake Wars', label: 'Enemy Territory: Quake Wars', queryProtocol: 'etqw' },
                    { value: 'F.E.A.R.', label: 'F.E.A.R.', queryProtocol: 'fear' },
                    { value: 'F1 Career Challenge', label: 'F1 Challenge \'99-\'02', queryProtocol: 'f1c9902' },
                    { value: 'Far Cry', label: 'Far Cry', queryProtocol: 'farcry' },
                    { value: 'Far Cry 2', label: 'Far Cry 2', queryProtocol: 'farcry2' },
                    { value: 'Formula One 2002', label: 'Formula One 2002', queryProtocol: 'f12002' },
                    { value: 'Fortress Forever', label: 'Fortress Forever', queryProtocol: 'fortressforever' },
                    { value: 'Frontlines: Fuel of War', label: 'Frontlines: Fuel of War', queryProtocol: 'ffow' },
                    { value: 'Garry\'s Mod', label: 'Garry\'s Mod', queryProtocol: 'garrysmod' },
                    { value: 'Geneshift', label: 'Geneshift', queryProtocol: 'geneshift' },
                    { value: 'Giants: Citizen Kabuto', label: 'Giants: Citizen Kabuto', queryProtocol: 'giantscitizenkabuto' },
                    { value: 'Global Operations', label: 'Global Operations', queryProtocol: 'globaloperations' },
                    { value: 'James Bond: GoldenEye: Source', label: 'GoldenEye: Source', queryProtocol: 'ges' },
                    { value: 'Gore: Ultimate Soldier', label: 'Gore: Ultimate Soldier', queryProtocol: 'gore' },
                    { value: 'FiveM', label: 'Grand Theft Auto V - FiveM', queryProtocol: 'fivem' },
                    { value: 'Grand Theft Auto: San Andreas', label: 'Grand Theft Auto: San Andreas', queryProtocol: 'samp' },
                    { value: 'Grand Theft Auto: Vice City', label: 'Grand Theft Auto: Vice City', queryProtocol: 'vcmp' },
                    { value: 'Multi Theft Auto: San Andreas', label: 'Grand Theft Auto: San Andreas - Multi Theft Auto', queryProtocol: 'mtasa' },
                    { value: 'Multi Theft Auto: Vice City', label: 'Grand Theft Auto: Vice City - Multi Theft Auto', queryProtocol: 'mtavc' },
                    { value: 'Ground Breach', label: 'Ground Breach', queryProtocol: 'groundbreach' },
                    { value: 'Gunman Chronicles', label: 'Gunman Chronicles', queryProtocol: 'gunmanchronicles' },
                    { value: 'Half-Life 2: Deathmatch', label: 'Half-Life 2: Deathmatch', queryProtocol: 'hl2dm' },
                    { value: 'Half-Life Deathmatch', label: 'Half-Life Deathmatch', queryProtocol: 'hldm' },
                    { value: 'Half-Life Deathmatch: Source', label: 'Half-Life Deathmatch: Source', queryProtocol: 'hldms' },
                    { value: 'Halo', label: 'Halo', queryProtocol: 'halo' },
                    { value: 'Halo 2', label: 'Halo 2', queryProtocol: 'halo2' },
                    { value: 'Hell Let Loose', label: 'Hell Let Loose', queryProtocol: 'hll' },
                    { value: 'Heretic II', label: 'Heretic II', queryProtocol: 'heretic2' },
                    { value: 'Hexen II', label: 'Hexen II', queryProtocol: 'hexen2' },
                    { value: 'Hidden & Dangerous 2', label: 'Hidden & Dangerous 2', queryProtocol: 'had2' },
                    { value: 'Homefront', label: 'Homefront', queryProtocol: 'homefront' },
                    { value: 'Homeworld 2', label: 'Homeworld 2', queryProtocol: 'homeworld2' },
                    { value: 'Hurtworld', label: 'Hurtworld', queryProtocol: 'hurtworld' },
                    { value: 'I.G.I.-2: Covert Strike', label: 'I.G.I.-2: Covert Strike', queryProtocol: 'igi2' },
                    { value: 'IL-2 Sturmovik', label: 'IL-2 Sturmovik', queryProtocol: 'il2' },
                    { value: 'Insurgency', label: 'Insurgency', queryProtocol: 'insurgency' },
                    { value: 'Insurgency: Sandstorm', label: 'Insurgency: Sandstorm', queryProtocol: 'insurgencysandstorm' },
                    { value: 'Iron Storm', label: 'Iron Storm', queryProtocol: 'ironstorm' },
                    { value: 'James Bond 007: Nightfire', label: 'James Bond 007: Nightfire', queryProtocol: 'jamesbondnightfire' },
                    { value: 'Just Cause 2', label: 'Just Cause 2 - Multiplayer', queryProtocol: 'jc2mp' },
                    { value: 'Just Cause 3', label: 'Just Cause 3 - Multiplayer', queryProtocol: 'jc3mp' },
                    { value: 'Kerbal Space Program', label: 'Kerbal Space Program - DMP Multiplayer', queryProtocol: 'kspdmp' },
                    { value: 'Killing Floor', label: 'Killing Floor', queryProtocol: 'killingfloor' },
                    { value: 'Killing Floor 2', label: 'Killing Floor 2', queryProtocol: 'killingfloor2' },
                    { value: 'Kingpin: Life of Crime', label: 'Kingpin: Life of Crime', queryProtocol: 'kingpin' },
                    { value: 'Kiss: Psycho Circus: The Nightmare Child', label: 'Kiss: Psycho Circus: The Nightmare Child', queryProtocol: 'kisspc' },
                    { value: 'Kreedz Climbing', label: 'Kreedz Climbing', queryProtocol: 'kzmod' },
                    { value: 'Left 4 Dead', label: 'Left 4 Dead', queryProtocol: 'left4dead' },
                    { value: 'Left 4 Dead 2', label: 'Left 4 Dead 2', queryProtocol: 'left4dead2' },
                    { value: 'Mafia II - Multiplayer', label: 'Mafia II - Multiplayer', queryProtocol: 'm2mp' },
                    { value: 'Mafia II - Online', label: 'Mafia II - Online', queryProtocol: 'm2o' },
                    { value: 'Medal of Honor', label: 'Medal of Honor', queryProtocol: 'moh2010' },
                    { value: 'Medal of Honor: Airborne', label: 'Medal of Honor: Airborne', queryProtocol: 'mohab' },
                    { value: 'Medal of Honor: Allied Assault', label: 'Medal of Honor: Allied Assault', queryProtocol: 'mohaa' },
                    { value: 'Medal of Honor: Allied Assault Breakthrough', label: 'Medal of Honor: Allied Assault Breakthrough', queryProtocol: 'mohbt' },
                    { value: 'Medal of Honor: Allied Assault Spearhead', label: 'Medal of Honor: Allied Assault Spearhead', queryProtocol: 'mohsh' },
                    { value: 'Medal of Honor: Pacific Assault', label: 'Medal of Honor: Pacific Assault', queryProtocol: 'mohpa' },
                    { value: 'Medal of Honor: Warfighter', label: 'Medal of Honor: Warfighter', queryProtocol: 'mohwf' },
                    { value: 'Medieval Engineers', label: 'Medieval Engineers', queryProtocol: 'medievalengineers' },
                    { value: 'Minecraft', label: 'Minecraft: Java Edition', queryProtocol: 'minecraft' },
                    { value: 'Minecraft: Bedrock Edition', label: 'Minecraft: Bedrock Edition', queryProtocol: 'minecraftbe' },
                    { value: 'Monday Night Combat', label: 'Monday Night Combat', queryProtocol: 'mnc' },
                    { value: 'Mordhau', label: 'Mordhau', queryProtocol: 'mordhau' },
                    { value: 'Mumble', label: 'Mumble - GTmurmur Plugin', queryProtocol: 'mumble' },
                    { value: 'Mumble', label: 'Mumble - Lightweight', queryProtocol: 'mumbleping' },
                    { value: 'NASCAR Thunder 2004', label: 'NASCAR Thunder 2004', queryProtocol: 'nascarthunder2004' },
                    { value: 'Natural Selection', label: 'Natural Selection', queryProtocol: 'ns' },
                    { value: 'Natural Selection 2', label: 'Natural Selection 2', queryProtocol: 'ns2' },
                    { value: 'Need for Speed: Hot Pursuit 2', label: 'Need for Speed: Hot Pursuit 2', queryProtocol: 'nfshp2' },
                    { value: 'Nerf Arena Blast', label: 'Nerf Arena Blast', queryProtocol: 'nab' },
                    { value: 'netPanzer', label: 'netPanzer', queryProtocol: 'netpanzer' },
                    { value: 'Neverwinter Nights', label: 'Neverwinter Nights', queryProtocol: 'nwn' },
                    { value: 'Neverwinter Nights 2', label: 'Neverwinter Nights 2', queryProtocol: 'nwn2' },
                    { value: 'Nexuiz', label: 'Nexuiz', queryProtocol: 'nexuiz' },
                    { value: 'Nitro Family', label: 'Nitro Family', queryProtocol: 'nitrofamily' },
                    { value: 'No More Room in Hell', label: 'No More Room in Hell', queryProtocol: 'nmrih' },
                    { value: 'No One Lives Forever 2: A Spy in H.A.R.M.\'s Way', label: 'No One Lives Forever 2: A Spy in H.A.R.M.\'s Way', queryProtocol: 'nolf2' },
                    { value: 'Nuclear Dawn', label: 'Nuclear Dawn', queryProtocol: 'nucleardawn' },
                    { value: 'OpenArena', label: 'OpenArena', queryProtocol: 'openarena' },
                    { value: 'OpenTTD', label: 'OpenTTD', queryProtocol: 'openttd' },
                    { value: 'Operation Flashpoint: Cold War Crisis', label: 'Operation Flashpoint: Cold War Crisis', queryProtocol: 'operationflashpoint' },
                    { value: 'Operation Flashpoint: Resistance', label: 'Operation Flashpoint: Resistance', queryProtocol: 'flashpointresistance' },
                    { value: 'Painkiller', label: 'Painkiller', queryProtocol: 'painkiller' },
                    { value: 'PixARK', label: 'PixARK', queryProtocol: 'pixark' },
                    { value: 'Post Scriptum', label: 'Post Scriptum', queryProtocol: 'ps' },
                    { value: 'Postal 2', label: 'Postal 2', queryProtocol: 'postal2' },
                    { value: 'Prey', label: 'Prey', queryProtocol: 'prey' },
                    { value: 'Primal Carnage: Extinction', label: 'Primal Carnage: Extinction', queryProtocol: 'primalcarnage' },
                    { value: 'Project Reality: Battlefield 2', label: 'Project Reality: Battlefield 2', queryProtocol: 'prbf2' },
                    { value: 'Project Zomboid', label: 'Project Zomboid', queryProtocol: 'przomboid' },
                    { value: 'Quake 1: QuakeWorld', label: 'Quake 1: QuakeWorld', queryProtocol: 'quake1' },
                    { value: 'Quake 2', label: 'Quake 2', queryProtocol: 'quake2' },
                    { value: 'Quake 3: Arena', label: 'Quake 3: Arena', queryProtocol: 'quake3' },
                    { value: 'Quake 4', label: 'Quake 4', queryProtocol: 'quake4' },
                    { value: 'Quake Live', label: 'Quake Live', queryProtocol: 'quakelive' },
                    { value: 'Rag Doll Kung Fu', label: 'Rag Doll Kung Fu', queryProtocol: 'ragdollkungfu' },
                    { value: 'Rainbow Six', label: 'Rainbow Six', queryProtocol: 'r6' },
                    { value: 'Rainbow Six 2: Rogue Spear', label: 'Rainbow Six 2: Rogue Spear', queryProtocol: 'r6roguespear' },
                    { value: 'Rainbow Six 3: Raven Shield', label: 'Rainbow Six 3: Raven Shield', queryProtocol: 'r6ravenshield' },
                    { value: 'RalliSport Challenge', label: 'RalliSport Challenge', queryProtocol: 'rallisportchallenge' },
                    { value: 'Rally Masters', label: 'Rally Masters', queryProtocol: 'rallymasters' },
                    { value: 'Red Orchestra', label: 'Red Orchestra', queryProtocol: 'redorchestra' },
                    { value: 'Red Orchestra 2', label: 'Red Orchestra 2', queryProtocol: 'redorchestra2' },
                    { value: 'Red Orchestra: Ostfront 41-45', label: 'Red Orchestra: Ostfront 41-45', queryProtocol: 'redorchestraost' },
                    { value: 'Redline', label: 'Redline', queryProtocol: 'redline' },
                    { value: 'RedM', label: 'Red Dead Redemption 2 - RedM', queryProtocol: 'fivem' },
                    { value: 'Return to Castle Wolfenstein', label: 'Return to Castle Wolfenstein', queryProtocol: 'rtcw' },
                    { value: 'rFactor', label: 'rFactor', queryProtocol: 'rfactor' },
                    { value: 'Ricochet', label: 'Ricochet', queryProtocol: 'ricochet' },
                    { value: 'Rise of Nations', label: 'Rise of Nations', queryProtocol: 'riseofnations' },
                    { value: 'Rising Storm 2: Vietnam', label: 'Rising Storm 2: Vietnam', queryProtocol: 'rs2' },
                    { value: 'Rune', label: 'Rune', queryProtocol: 'rune' },
                    { value: 'Rust', label: 'Rust', queryProtocol: 'rust' },
                    { value: 'S.T.A.L.K.E.R.', label: 'S.T.A.L.K.E.R.', queryProtocol: 'stalker' },
                    { value: 'Savage 2: A Tortured Soul', label: 'Savage 2: A Tortured Soul', queryProtocol: 'savage2' },
                    { value: 'Serious Sam', label: 'Serious Sam', queryProtocol: 'ss' },
                    { value: 'Serious Sam 2', label: 'Serious Sam 2', queryProtocol: 'ss2' },
                    { value: 'Shattered Horizon', label: 'Shattered Horizon', queryProtocol: 'shatteredhorizon' },
                    { value: 'Shogo', label: 'Shogo', queryProtocol: 'shogo' },
                    { value: 'Shootmania', label: 'Shootmania', queryProtocol: 'shootmania' },
                    { value: 'SiN', label: 'SiN', queryProtocol: 'sin' },
                    { value: 'SiN Episodes', label: 'SiN Episodes', queryProtocol: 'sinep' },
                    { value: 'Soldat', label: 'Soldat', queryProtocol: 'soldat' },
                    { value: 'Soldier of Fortune', label: 'Soldier of Fortune', queryProtocol: 'sof' },
                    { value: 'Soldier of Fortune 2', label: 'Soldier of Fortune 2', queryProtocol: 'sof2' },
                    { value: 'Space Engineers', label: 'Space Engineers', queryProtocol: 'spaceengineers' },
                    { value: 'Squad', label: 'Squad', queryProtocol: 'squad' },
                    { value: 'Star Trek: Bridge Commander', label: 'Star Trek: Bridge Commander', queryProtocol: 'stbc' },
                    { value: 'Star Trek: Voyager - Elite Force', label: 'Star Trek: Voyager - Elite Force', queryProtocol: 'stvef' },
                    { value: 'Star Trek: Voyager - Elite Force 2', label: 'Star Trek: Voyager - Elite Force 2', queryProtocol: 'stvef2' },
                    { value: 'Star Wars Jedi Knight: Jedi Academy', label: 'Star Wars Jedi Knight II: Jedi Outcast', queryProtocol: 'swjk2' },
                    { value: 'star wars jedi knight: jedi academy', label: 'Star Wars Jedi Knight: Jedi Academy', queryProtocol: 'swjk' },
                    { value: 'Star Wars: Battlefront', label: 'Star Wars: Battlefront', queryProtocol: 'swbf' },
                    { value: 'Star Wars: Battlefront 2', label: 'Star Wars: Battlefront 2', queryProtocol: 'swbf2' },
                    { value: 'Star Wars: Republic Commando', label: 'Star Wars: Republic Commando', queryProtocol: 'swrc' },
                    { value: 'Starbound', label: 'Starbound', queryProtocol: 'starbound' },
                    { value: 'StarMade', label: 'StarMade', queryProtocol: 'starmade' },
                    { value: 'Starsiege', label: 'Starsiege', queryProtocol: 'starsiege' },
                    { value: 'Suicide Survival', label: 'Suicide Survival', queryProtocol: 'suicidesurvival' },
                    { value: 'Survive the Nights', label: 'Survive the Nights', queryProtocol: 'stn' },
                    { value: 'Sven Coop', label: 'Sven Coop', queryProtocol: 'svencoop' },
                    { value: 'SWAT 4', label: 'SWAT 4', queryProtocol: 'swat4' },
                    { value: 'Synergy', label: 'Synergy', queryProtocol: 'synergy' },
                    { value: 'Tactical Ops', label: 'Tactical Ops', queryProtocol: 'tacticalops' },
                    { value: 'Take On Helicopters', label: 'Take On Helicopters', queryProtocol: 'takeonhelicopters' },
                    { value: 'Team Factor', label: 'Team Factor', queryProtocol: 'teamfactor' },
                    { value: 'Team Fortress 2', label: 'Team Fortress 2', queryProtocol: 'tf2' },
                    { value: 'Team Fortress Classic', label: 'Team Fortress Classic', queryProtocol: 'tfc' },
                    { value: 'Teamspeak 2', label: 'Teamspeak 2', queryProtocol: 'teamspeak2' },
                    { value: 'Teamspeak 3', label: 'Teamspeak 3', queryProtocol: 'teamspeak3' },
                    { value: 'Terminus', label: 'Terminus', queryProtocol: 'terminus' },
                    { value: 'Terraria', label: 'Terraria - TShock', queryProtocol: 'tshock' },
                    { value: 'The Forrest', label: 'The Forrest', queryProtocol: 'forrest' },
                    { value: 'The Hidden', label: 'The Hidden', queryProtocol: 'hidden' },
                    { value: 'The Operative: No One Lives Forever', label: 'The Operative: No One Lives Forever', queryProtocol: 'nolf' },
                    { value: 'The Ship', label: 'The Ship', queryProtocol: 'ship' },
                    { value: 'Tom Clancy\'s Ghost Recon Advanced Warfighter', label: 'Tom Clancy\'s Ghost Recon Advanced Warfighter', queryProtocol: 'graw' },
                    { value: 'Tom Clancy\'s Ghost Recon Advanced Warfighter 2', label: 'Tom Clancy\'s Ghost Recon Advanced Warfighter 2', queryProtocol: 'graw2' },
                    { value: 'Tony Hawk\'s Pro Skater 3', label: 'Tony Hawk\'s Pro Skater 3', queryProtocol: 'thps3' },
                    { value: 'Tony Hawk\'s Pro Skater 4', label: 'Tony Hawk\'s Pro Skater 4', queryProtocol: 'thps4' },
                    { value: 'Tony Hawk\'s Underground 2', label: 'Tony Hawk\'s Underground 2', queryProtocol: 'thu2' },
                    { value: 'Tower Unite', label: 'Tower Unite', queryProtocol: 'towerunite' },
                    { value: 'Trackmania 2', label: 'Trackmania 2', queryProtocol: 'trackmania2' },
                    { value: 'Trackmania Forever', label: 'Trackmania Forever', queryProtocol: 'trackmaniaforever' },
                    { value: 'Tremulous', label: 'Tremulous', queryProtocol: 'tremulous' },
                    { value: 'Tribes 1: Starsiege', label: 'Tribes 1: Starsiege', queryProtocol: 'tribes1' },
                    { value: 'Tribes: Vengeance', label: 'Tribes: Vengeance', queryProtocol: 'tribesvengeance' },
                    { value: 'Tron 2.0', label: 'Tron 2.0', queryProtocol: 'tron20' },
                    { value: 'Turok 2', label: 'Turok 2', queryProtocol: 'turok2' },
                    { value: 'Universal Combat', label: 'Universal Combat', queryProtocol: 'universalcombat' },
                    { value: 'Unreal', label: 'Unreal', queryProtocol: 'unreal' },
                    { value: 'Unreal Tournament', label: 'Unreal Tournament', queryProtocol: 'ut' },
                    { value: 'Unreal Tournament 2003', label: 'Unreal Tournament 2003', queryProtocol: 'ut2003' },
                    { value: 'Unreal Tournament 2004', label: 'Unreal Tournament 2004', queryProtocol: 'ut2004' },
                    { value: 'Unreal Tournament 3', label: 'Unreal Tournament 3', queryProtocol: 'ut3	' },
                    { value: 'unturned', label: 'unturned', queryProtocol: 'unturned' },
                    { value: 'Urban Terror', label: 'Urban Terror', queryProtocol: 'urbanterror' },
                    { value: 'V Rising', label: 'V Rising', queryProtocol: 'vrising' },
                    { value: 'V8 Supercar Challenge', label: 'V8 Supercar Challenge', queryProtocol: 'v8supercar' },
                    { value: 'Valheim', label: 'Valheim', queryProtocol: 'valheim' },
                    { value: 'Ventrilo', label: 'Ventrilo', queryProtocol: 'ventrilo' },
                    { value: 'Vietcong', label: 'Vietcong', queryProtocol: 'vietcong' },
                    { value: 'Vietcong 2', label: 'Vietcong 2', queryProtocol: 'vietcong2' },
                    { value: 'Warsow', label: 'Warsow', queryProtocol: 'warsow' },
                    { value: 'Wheel of Time', label: 'Wheel of Time', queryProtocol: 'wheeloftime' },
                    { value: 'Wolfenstein', label: 'Wolfenstein', queryProtocol: 'wolfenstein2009' },
                    { value: 'Wolfenstein: Enemy Territory', label: 'Wolfenstein: Enemy Territory', queryProtocol: 'wolfensteinet' },
                    { value: 'Xpand Rally', label: 'Xpand Rally', queryProtocol: 'xpandrally' },
                    { value: 'Zombie Master', label: 'Zombie Master', queryProtocol: 'zombiemaster' },
                    { value: 'Zombie Panic: Source', label: 'Zombie Panic: Source', queryProtocol: 'zps' },
                ],
                settings: {
                    ip: '',
                    connection_port: '',
                    query_port: '',
                    game: '',
                    query_protocol: '',
                },
            };
        },
        methods: {
            updateSettings() {
                this.updateStatus = 'loading';
                axios.post(`${process.env.VUE_APP_BACKEND_URL}api/post/write-server-settings/${this.guild_id}/${this.server_uuid}`, { settings: this.settings })
                    .then((response) => {
                        this.updateStatus = 'success';
                        this.servers = response.data;
                        if (this.servers.length > 0) {
                            this.isSideNavCompressed = false;
                            this.servers.forEach((server) => {
                                this.hoverStates[server.id] = false;
                            });
                        }
                        this.$emit('update')
                    })
                    .catch((error) => {
                        this.updateStatus = 'error';
                        console.log('Error writing bot settings', error);
                    });
            },
            getQueryProtocol(option) {
                this.updateStatus = null; 
                if (option) {
                    this.settings.query_protocol = option.queryProtocol;
                } else {
                    this.settings.query_protocol = '';
                }
            },
            setupSettings(serverSettings, settings) {
                Object.keys(settings).forEach(key => {
                    if (key in serverSettings) {
                        settings[key] = serverSettings[key];
                    }
                });
            }
        },
        mounted() {
            if (this.serverData && this.serverData.server_settings) {
                this.setupSettings(this.serverData.server_settings, this.settings);
            }
        },
    }
</script>

<style src="./settings_styles.css" scoped></style>