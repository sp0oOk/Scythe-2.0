/**
 * Holds An Array Of Loaded Commands (Remove from the array to disable easily or disable manually in command file)
 */

import { _CommandHug_ } from "../commands/anime/_CommandHug_";
import { _CommandKiss_ } from "../commands/anime/_CommandKiss_";
import { _CommandSlap_ } from "../commands/anime/_CommandSlap_";
import { _CommandTickle_ } from "../commands/anime/_CommandTickle_";
import { _Command8Ball_ } from "../commands/fun/_Command8Ball_";
import { _CommandAdvice_ } from "../commands/fun/_CommandAdvice_";
import { _CommandBase64_ } from "../commands/fun/_CommandBase64_";
import { _CommandBird_ } from "../commands/fun/_CommandBird_";
import { _CommandCat_ } from "../commands/fun/_CommandCat_";
import { _CommandCoinflip_ } from "../commands/fun/_CommandCoinflip_";
import { _CommandLevel_ } from "../commands/fun/_CommandLevel_";
import { _CommandNamemc_ } from "../commands/fun/_CommandNamemc_";
import { _CommandShibe_ } from "../commands/fun/_CommandShibe_";
import { _CommandAvatar_ } from "../commands/information/_CommandAvatar_";
import { _CommandBotInfo_ } from "../commands/information/_CommandBotInfo_";
import { _CommandChannelInfo_ } from "../commands/information/_CommandChannelInfo_";
import { _CommandChannels_ } from "../commands/information/_CommandChannels_";
import { _CommandEmoji_ } from "../commands/information/_CommandEmoji_";
import { _CommandInviteInfo_ } from "../commands/information/_CommandInviteInfo_";
import { _CommandProfile_ } from "../commands/minecraft/_CommandProfile_";
import { _CommandReSync } from "../commands/minecraft/_CommandReSync_";
import { _CommandUnlink_ } from "../commands/minecraft/_CommandUnlink_";
import { _CommandVerify_ } from "../commands/minecraft/_CommandVerify_";
import { _CommandSuggestionResponse_ } from "../commands/miscellaneous/_CommandSuggestionResponse_";
import { _CommandSuggestion_ } from "../commands/miscellaneous/_CommandSuggestion_";
import { _CommandBan_ } from "../commands/moderation/_CommandBan_";
import { _CommandKick_ } from "../commands/moderation/_CommandKick_";
import { _CommandSnipe_ } from "../commands/moderation/_CommandSnipe_";
import { _CommandTimeout_ } from "../commands/moderation/_CommandTimeout_";
import { _CommandLyrics_ } from "../commands/music/_CommandLyrics_";
import { _CommandPlay_ } from "../commands/music/_CommandPlay_";
import { _CommandVolume_ } from "../commands/music/_CommandVolume_";
import { _Command4k_ } from "../commands/nsfw/_Command4k_";
import { _CommandAnal_ } from "../commands/nsfw/_CommandAnal_";
import { _CommandAss_ } from "../commands/nsfw/_CommandAss_";
import { _CommandBoobs_ } from "../commands/nsfw/_CommandBoobs_";
import { _CommandHanal_ } from "../commands/nsfw/_CommandHanal_";
import { _CommandHass_ } from "../commands/nsfw/_CommandHass_";
import { _CommandHboobs_ } from "../commands/nsfw/_CommandHboobs_";
import { _CommandHentai_ } from "../commands/nsfw/_CommandHentai_";
import { _CommandHkitsune } from "../commands/nsfw/_CommandHkitsune_";
import { _CommandHmidriff_ } from "../commands/nsfw/_CommandHmidriff_";
import { _CommandHneko_ } from "../commands/nsfw/_CommandHneko_";
import { _CommandHolo_ } from "../commands/nsfw/_CommandHolo_";
import { _CommandKemonomini_ } from "../commands/nsfw/_CommandKemonomini_";
import { _CommandNeko_ } from "../commands/nsfw/_CommandNeko_";
import { _CommandPgif_ } from "../commands/nsfw/_CommandPgif_";
import { _CommandPussy_ } from "../commands/nsfw/_CommandPussy_";
import { _CommandYaoi_ } from "../commands/nsfw/_CommandYaoi_";
import { _CommandBlacklist_ } from "../commands/settings/_CommandBlacklist_";
import { _CommandPerms_ } from "../commands/settings/_CommandPerms_";
import { _CommandAddTicketCategory_ } from "../commands/tickets/_CommandAddCategory_";
import { _CommandCloseTicket_ } from "../commands/tickets/_CommandCloseTicket_";
import { _CommandRemoveTicketCategory_ } from "../commands/tickets/_CommandDeleteCatergory_";
import { _CommandDeleteTicketChannel_ } from "../commands/tickets/_CommandDeleteChannel_";
import { _CommandToggleTickets_ } from "../commands/tickets/_CommandEnableTickets_";
import { _CommandSetTicketLogChannel_ } from "../commands/tickets/_CommandSetTicketLogChannel_";
import { _CommandTicketLog_ } from "../commands/tickets/_CommandTicketLogs_";
import { _CommandSetupTickets_ } from "../commands/tickets/_CommandTicketSetup_";
import { _CommandTicketStats_ } from "../commands/tickets/_CommandTicketStats_";
import { _CommandHelp_ } from "../commands/utility/_CommandHelp_";
import { PCommand } from "../interfaces/PCommand";

 
 export const PCommandList: PCommand[] = [
     // MODERATION //
     _CommandBan_,
     _CommandKick_,
     _CommandTimeout_,
     _CommandSnipe_,
     // UTILITY //
     _CommandHelp_,
     // MISCELLANEOUS //
     _CommandSuggestion_,
     _CommandSuggestionResponse_,
     // INFORMATION //
     _CommandAvatar_,
     _CommandChannelInfo_,
     _CommandChannels_,
     _CommandBotInfo_,
     _CommandEmoji_,
     _CommandInviteInfo_,
     // ANIME //
     _CommandSlap_,
     _CommandKiss_,
     _CommandTickle_,
     _CommandHug_,
     // MUSIC //
     _CommandPlay_,
     _CommandVolume_,
     _CommandLyrics_,
     // SETTINGS //
     _CommandPerms_,
     _CommandBlacklist_,
     // FUN //
     _Command8Ball_,
     _CommandCat_,
     _CommandBase64_,
     _CommandAdvice_,
     _CommandBird_,
     _CommandShibe_,
     _CommandCoinflip_,
     _CommandLevel_,
     _CommandNamemc_,
     // Tickets //
     _CommandAddTicketCategory_,
     _CommandCloseTicket_,
     _CommandDeleteTicketChannel_,
     _CommandToggleTickets_,
     _CommandRemoveTicketCategory_,
     _CommandTicketStats_,
     _CommandTicketLog_,
     _CommandSetupTickets_,
     _CommandSetTicketLogChannel_,
     // NSFW //
     _Command4k_,
     _CommandAnal_,
     _CommandAss_,
     _CommandBoobs_,
     _CommandHanal_,
     _CommandHass_,
     _CommandHboobs_,
     _CommandHentai_,
     _CommandHkitsune,
     _CommandHmidriff_,
     _CommandKemonomini_,
     _CommandHneko_,
     _CommandHolo_,
     _CommandNeko_,
     _CommandPgif_,
     _CommandPussy_,
     _CommandYaoi_,
     // MINECRAFT //
     _CommandVerify_,
     _CommandProfile_,
     _CommandUnlink_,
     _CommandReSync
 ]